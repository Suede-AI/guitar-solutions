import { describe, expect, it } from 'vitest';

import {
  GUITAR_SERVICES_HOST,
  SUEDE_ORG_ID,
  SUEDE_ORG_NAME,
  resolveSiteIdentity,
} from '../site-identity';
import { guitarServicesSchema, SURFACES } from '../guitar-services-content';
import { aboutSchema, FAQ } from '../about-content';

// These guards assert on the DEFECT CLASS (the identity claim), not on a set of
// remembered literal strings. The 2026-08-18 audit found guitar.services — the
// only host this deployment serves live — asserting a foreign identity:
//   1. a WebSite @id on https://guides.guitar.solutions (another host),
//   2. two conflicting Organization names ("Suede Labs" vs "Suede Labs AI"),
//   3. an About FAQ claiming guitar.solutions "redirects" when it returns 200
//      self-canonical (verified live: guides.guitar.solutions 308s away, the
//      apex guitar.solutions does not).
// Each claim is checked below against the exact objects the pages serialize.

type JsonLdNode = Record<string, unknown>;

function graphOf(schema: unknown): JsonLdNode[] {
  if (!schema || typeof schema !== 'object') return [];
  const graph = (schema as Record<string, unknown>)['@graph'];
  return Array.isArray(graph) ? (graph as JsonLdNode[]) : [schema as JsonLdNode];
}

function originOf(id: unknown): string {
  if (typeof id !== 'string') return '';
  try {
    return new URL(id).origin;
  } catch {
    return '';
  }
}

/** Every string value stored under an "@id" key, at any depth. */
function collectIds(value: unknown, out: string[] = []): string[] {
  if (Array.isArray(value)) {
    value.forEach((v) => collectIds(v, out));
  } else if (value && typeof value === 'object') {
    for (const [k, v] of Object.entries(value)) {
      if (k === '@id' && typeof v === 'string') out.push(v);
      else collectIds(v, out);
    }
  }
  return out;
}

/** Names of DEFINED Organization nodes (those with @type Organization), at any depth. */
function orgNames(value: unknown, out: string[] = []): string[] {
  if (Array.isArray(value)) {
    value.forEach((v) => orgNames(v, out));
  } else if (value && typeof value === 'object') {
    const node = value as Record<string, unknown>;
    if (node['@type'] === 'Organization' && typeof node.name === 'string') {
      out.push(node.name);
    }
    Object.values(node).forEach((v) => orgNames(v, out));
  }
  return out;
}

function identityNodes(value: unknown, out: JsonLdNode[] = []): JsonLdNode[] {
  if (Array.isArray(value)) {
    value.forEach((v) => identityNodes(v, out));
  } else if (value && typeof value === 'object') {
    const node = value as Record<string, unknown>;
    const type = node['@type'];
    if ((type === 'WebSite' || type === 'WebPage') && typeof node['@id'] === 'string') {
      out.push(node);
    }
    Object.values(node).forEach((v) => identityNodes(v, out));
  }
  return out;
}

// The JSON-LD actually served on each live host = the layout's host-resolved
// global graph (if any) + the page's own graph.
const servedHome = [
  ...graphOf(resolveSiteIdentity(GUITAR_SERVICES_HOST).jsonLd),
  ...graphOf(guitarServicesSchema),
];
const servedAbout = [
  ...graphOf(resolveSiteIdentity(GUITAR_SERVICES_HOST).jsonLd),
  ...graphOf(aboutSchema),
];

describe('claim 1 — guitar.services never asserts another host as its own identity', () => {
  it('the shared layout adds no global identity/chrome on the live host', () => {
    const identity = resolveSiteIdentity(GUITAR_SERVICES_HOST);
    expect(identity.jsonLd).toBeNull();
    expect(identity.chrome).toBe('none');
  });

  it('normalizes www./port and still resolves to the live host identity', () => {
    expect(resolveSiteIdentity('www.guitar.services:3000').chrome).toBe('none');
    expect(resolveSiteIdentity('GUITAR.SERVICES').jsonLd).toBeNull();
  });

  it.each([
    ['home', servedHome],
    ['about', servedAbout],
  ])('served %s page carries no foreign guides.guitar.solutions @id', (_label, nodes) => {
    const foreign = collectIds(nodes).filter(
      (id) => originOf(id) === 'https://guides.guitar.solutions',
    );
    expect(foreign).toEqual([]);
  });

  it.each([
    ['home', servedHome],
    ['about', servedAbout],
  ])('every WebSite/WebPage identity node on the served %s page is keyed to guitar.services', (_label, nodes) => {
    const ids = identityNodes(nodes).map((n) => n['@id']);
    expect(ids.length).toBeGreaterThan(0); // non-vacuous: there IS an identity node
    for (const id of ids) {
      expect(originOf(id)).toBe('https://guitar.services');
    }
  });
});

describe('claim 2 — exactly one organization, named "Suede Labs AI"', () => {
  it('SUEDE_ORG_NAME is the canonical name', () => {
    expect(SUEDE_ORG_NAME).toBe('Suede Labs AI');
  });

  it('the served guitar.services home page defines exactly one org, canonical', () => {
    const names = orgNames(servedHome);
    expect(names).toEqual([SUEDE_ORG_NAME]);
    expect(names).not.toContain('Suede Labs'); // the old conflicting name is gone
  });

  it('no served surface defines an Organization named anything but "Suede Labs AI"', () => {
    for (const nodes of [servedHome, servedAbout]) {
      for (const name of orgNames(nodes)) {
        expect(name).toBe(SUEDE_ORG_NAME);
      }
    }
  });

  it('the single org node references the canonical @id (no second anonymous org)', () => {
    const orgIds = graphOf(guitarServicesSchema)
      .filter((n) => n['@type'] === 'Organization')
      .map((n) => n['@id']);
    expect(orgIds).toEqual([SUEDE_ORG_ID]);
  });

  it('the guides fallback identity is self-consistent (own WebSite @id, one canonical org)', () => {
    const guides = resolveSiteIdentity('guides.guitar.solutions');
    expect(guides.chrome).toBe('guides');
    const nodes = graphOf(guides.jsonLd);
    expect(orgNames(nodes)).toEqual([SUEDE_ORG_NAME]);
    const website = nodes.find((n) => n['@type'] === 'WebSite');
    expect(originOf(website?.['@id'])).toBe('https://guides.guitar.solutions');
  });
});

describe('claim 3 — no FAQ answer asserts the apex guitar.solutions redirects', () => {
  // Apex domain = "guitar.solutions" NOT preceded by a subdomain label char, so
  // the true "guides.guitar.solutions now redirects" statement is not matched.
  const APEX = /(?<![A-Za-z0-9.-])guitar\.solutions\b/i;
  const REDIRECT_CLAIM =
    /\b(redirects?|redirecting|redirected|now points|points at|no longer (?:serves|resolves|exists))\b/i;

  it('every FAQ answer is free of an apex-redirect claim', () => {
    for (const { q, a } of FAQ) {
      // Split into clauses on sentence/semicolon boundaries; domain dots are
      // never followed by whitespace, so domains stay intact.
      for (const clause of a.split(/[.;]\s+/)) {
        const offends = APEX.test(clause) && REDIRECT_CLAIM.test(clause);
        expect(
          offends,
          `FAQ "${q}" falsely couples apex guitar.solutions with a redirect claim: "${clause.trim()}"`,
        ).toBe(false);
      }
    }
  });
});

describe('claim 5 — the stale "Suede Studio Guitar" name is corrected', () => {
  const STALE = 'Suede Studio Guitar';
  const CORRECT = 'Suede Guitar Tuner & Studio';

  it('the iOS-app surface uses the real App Store name', () => {
    const ios = SURFACES.find((s) => s.kind === 'iOS App');
    expect(ios?.name).toBe(CORRECT);
    expect(SURFACES.map((s) => s.name)).not.toContain(STALE);
  });

  it('no FAQ answer still says the stale name', () => {
    for (const { a } of FAQ) {
      expect(a).not.toContain(STALE);
    }
  });
});
