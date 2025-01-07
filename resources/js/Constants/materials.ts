import {PlayerColor} from '@/types/game';
import * as THREE from 'three';

const materialRed = new THREE.MeshStandardMaterial({color: 0xef4444});
const materialRedStrong = new THREE.MeshStandardMaterial({color: 0xb91c1c});

const materialGreen = new THREE.MeshStandardMaterial({color: 0x4ade80});
const materialGreenStrong = new THREE.MeshStandardMaterial({color: 0x15803d});

const materialBlue = new THREE.MeshStandardMaterial({color: 0x38bdf8});
const materialBlueStrong = new THREE.MeshStandardMaterial({color: 0x1d4ed8});

const materialYellow = new THREE.MeshStandardMaterial({color: 0xfde047});
const materialYellowStrong = new THREE.MeshStandardMaterial({color: 0xeab308});

export const BOARD_PLACED_MATERIALS: {
    [key in PlayerColor]: THREE.MeshStandardMaterial;
} = Object.freeze({
    ['red']: materialRed,
    ['green']: materialGreen,
    ['blue']: materialBlue,
    ['yellow']: materialYellow,
});
export const BOARD_SELECTED_MATERIALS: {
    [key in PlayerColor]: THREE.MeshStandardMaterial;
} = Object.freeze({
    ['red']: materialRedStrong,
    ['green']: materialGreenStrong,
    ['blue']: materialBlueStrong,
    ['yellow']: materialYellowStrong,
});

const boardSidesMaterial = new THREE.MeshStandardMaterial({color: 0x444444});
const boardFrontMaterial = new THREE.MeshStandardMaterial({color: 0xffffff});

export const BOARD_MATERIALS = Object.freeze({
    ['sides']: boardSidesMaterial,
    ['front']: boardFrontMaterial,
});
