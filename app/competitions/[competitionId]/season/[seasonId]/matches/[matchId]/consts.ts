import { Location, PlayerPosition } from "@/app/types";

export const FIELD_WIDTH = 80;
export const FIELD_HEIGHT = 120;

export const PlayerPositionToLocation: { [key in PlayerPosition]: Location } = {
  Goalkeeper: [FIELD_WIDTH / 8, FIELD_HEIGHT / 2],
  "Left Back": [FIELD_WIDTH / 4, FIELD_HEIGHT / 8],
  "Left Center Back": [FIELD_WIDTH / 4, FIELD_HEIGHT / 3],
  "Center Back": [FIELD_WIDTH / 4, FIELD_HEIGHT / 2],
  "Right Center Back": [FIELD_WIDTH / 4, FIELD_HEIGHT / 1.5],
  "Right Back": [FIELD_WIDTH / 4, FIELD_HEIGHT / 1.125],
  "Left Wing Back": [FIELD_WIDTH / 2.5, FIELD_HEIGHT / 8],
  "Right Wing Back": [FIELD_WIDTH / 2.5, FIELD_HEIGHT / 1.125],
  "Left Defensive Midfield": [FIELD_WIDTH / 2, FIELD_HEIGHT / 8],
  "Center Defensive Midfield": [FIELD_WIDTH / 2, FIELD_HEIGHT / 2],
  "Right Defensive Midfield": [FIELD_WIDTH / 2, FIELD_HEIGHT / 1.125],
  "Left Midfield": [FIELD_WIDTH / 1.5, FIELD_HEIGHT / 8],
  "Left Center Midfield": [FIELD_WIDTH / 1.5, FIELD_HEIGHT / 3],
  "Center Midfield": [FIELD_WIDTH / 1.5, FIELD_HEIGHT / 2],
  "Right Center Midfield": [FIELD_WIDTH / 1.5, FIELD_HEIGHT / 1.5],
  "Right Midfield": [FIELD_WIDTH / 1.5, FIELD_HEIGHT / 1.125],
  "Left Wing": [FIELD_WIDTH / 1.25, FIELD_HEIGHT / 8],
  "Left Attacking Midfield": [FIELD_WIDTH / 1.25, FIELD_HEIGHT / 3],
  "Center Attacking Midfield": [FIELD_WIDTH / 1.25, FIELD_HEIGHT / 2],
  "Right Attacking Midfield": [FIELD_WIDTH / 1.25, FIELD_HEIGHT / 1.5],
  "Right Wing": [FIELD_WIDTH / 1.25, FIELD_HEIGHT / 1.125],
  "Left Center Forward": [FIELD_WIDTH / 1.125, FIELD_HEIGHT / 3],
  "Center Forward": [FIELD_WIDTH / 1.125, FIELD_HEIGHT / 2],
  "Right Center Forward": [FIELD_WIDTH / 1.125, FIELD_HEIGHT / 1.5],
  Striker: [FIELD_WIDTH / 1.125, FIELD_HEIGHT / 1.125],
  "Secondary Striker": [FIELD_WIDTH / 1.125, FIELD_HEIGHT / 1.125],
};

export const PlayerPositionToShort: { [key in PlayerPosition]: string } = {
  Goalkeeper: "GK",
  "Left Back": "LB",
  "Left Center Back": "LCB",
  "Center Back": "CB",
  "Right Center Back": "RCB",
  "Right Back": "RB",
  "Left Wing Back": "LWB",
  "Right Wing Back": "RWB",
  "Left Defensive Midfield": "LDM",
  "Center Defensive Midfield": "CDM",
  "Right Defensive Midfield": "RDM",
  "Left Midfield": "LM",
  "Left Center Midfield": "LCM",
  "Center Midfield": "CM",
  "Right Center Midfield": "RCM",
  "Right Midfield": "RM",
  "Left Wing": "LW",
  "Left Attacking Midfield": "LAM",
  "Center Attacking Midfield": "CAM",
  "Right Attacking Midfield": "RAM",
  "Right Wing": "RW",
  "Left Center Forward": "LCF",
  "Center Forward": "CF",
  "Right Center Forward": "RCF",
  Striker: "ST",
  "Secondary Striker": "SS",
};

export function reverseLocation(location: [number, number]) {
  return [FIELD_WIDTH - location[0], FIELD_HEIGHT - location[1]];
}

export function rotateLocation(location: [number, number]): [number, number] {
  return [location[1], location[0]];
}

export function flipLocation(location: [number, number]): [number, number] {
  return [location[0], FIELD_HEIGHT - location[1]];
}

export function adjustLocation(location: [number, number]): [number, number] {
  return flipLocation(rotateLocation(location));
}
