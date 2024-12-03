import { Plot } from "./models/interfaces/Plot";
import { Rosier } from "./models/interfaces/Rosier";

// Fake data
export const exploitations = [
  {
    uid: "e1",
    nom: "Test 1",
  },
  {
    uid: "e2",
    nom: "Test 2",
  },
];

export const exploitationOptions = exploitations.map(expl => ({
  value: expl.nom,
  label: expl.nom,
  uid: expl.uid,
}));

export const parcelles: Plot[] = [
  {
    uid: "p1",
    nom: "Parcelle B",
    map_expl: { uid: "e1", nom: "Test 1" },
    map_rosier: { uid: "r1", nom: "Rosier A1", archived: false },
    delayPassed: true,
    archived: false,
  },
  {
    uid: "p3",
    nom: "TNT",
    map_expl: { uid: "e1", nom: "Test 1" },
    map_rosier: { uid: "r2", nom: "Rosier A2", archived: true },
    delayPassed: true,
    archived: true,
  },
  {
    uid: "p2",
    nom: "Parcelle A",
    map_expl: { uid: "e1", nom: "Test 1" },
    map_rosier: { uid: "r3", nom: "Rosier A3", archived: true },
    delayPassed: true,
    archived: false,
  },
];

export const rosiersFake: Rosier[] = [
  {
    uid: "r1",
    nom: "Rosier A1",
    editionDelay: true,
    archived: false,
    map_zone: {
      uid: "p1",
      nom: "Parcelle B",
    },
  },
  {
    uid: "r2",
    nom: "Rosier A2",
    editionDelay: false,
    archived: false,
    map_zone: {
      uid: "p2",
      nom: "Parcelle A",
    },
  },
  {
    uid: "r3",
    nom: "Rosier A3",
    editionDelay: false,
    archived: true,
    map_zone: {
      uid: "p2",
      nom: "Parcelle A",
    },
  },
  {
    uid: "r4",
    nom: "Rosier A4",
    editionDelay: false,
    archived: false,
    map_zone: {
      uid: "p2",
      nom: "Parcelle A",
    },
  },
];
