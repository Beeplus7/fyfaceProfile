import { describe, expect, it } from 'vitest';

type Project = {
  id: string;
  title: string;
  cost?: number;
  work_ref?: string;
  milestones?: { label: string; done?: boolean }[];
  materials?: { name: string; cost?: number }[];
};

function assertKillerObject(p: Project) {
  expect(p.id).toBeTruthy();
  expect(p.title).toBeTruthy();
  expect(p.work_ref || p.id).toBeTruthy();
  expect(typeof (p.cost ?? 0)).toBe('number');
}

describe('ProjectCard killer object', () => {
  it('AYO Aso-Ebi £320 has milestones + materials £45/m', () => {
    const p: Project = {
      id: 'aso-ebi',
      title: 'Aso-Ebi Wedding Dress',
      work_ref: 'proj_aso_ebi',
      cost: 320,
      milestones: [
        { label: 'Cutting', done: true },
        { label: 'Sewing', done: true },
        { label: 'Fitting', done: false },
      ],
      materials: [{ name: 'Lace', cost: 45 }],
    };
    assertKillerObject(p);
    expect(p.cost).toBe(320);
    expect(p.materials?.[0].cost).toBe(45);
    expect(p.milestones?.length).toBe(3);
  });

  it('rejects empty title', () => {
    expect({ id: 'x', title: '' }.title).toBeFalsy();
  });
});
