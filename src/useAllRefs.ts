import { useRef } from "react";

export function useAllRefs(): {
  [prop: string]: React.MutableRefObject<HTMLDivElement | null>;
} {
  return {
    R1: useRef<HTMLDivElement | null>(null),
    H1: useRef<HTMLDivElement | null>(null),
    B1: useRef<HTMLDivElement | null>(null),
    Q1: useRef<HTMLDivElement | null>(null),
    K1: useRef<HTMLDivElement | null>(null),
    B2: useRef<HTMLDivElement | null>(null),
    H2: useRef<HTMLDivElement | null>(null),
    R2: useRef<HTMLDivElement | null>(null),
    R3: useRef<HTMLDivElement | null>(null),
    H3: useRef<HTMLDivElement | null>(null),
    B3: useRef<HTMLDivElement | null>(null),
    Q2: useRef<HTMLDivElement | null>(null),
    K2: useRef<HTMLDivElement | null>(null),
    B4: useRef<HTMLDivElement | null>(null),
    H4: useRef<HTMLDivElement | null>(null),
    R4: useRef<HTMLDivElement | null>(null),
    P1: useRef<HTMLDivElement | null>(null),
    P2: useRef<HTMLDivElement | null>(null),
    P3: useRef<HTMLDivElement | null>(null),
    P4: useRef<HTMLDivElement | null>(null),
    P5: useRef<HTMLDivElement | null>(null),
    P6: useRef<HTMLDivElement | null>(null),
    P7: useRef<HTMLDivElement | null>(null),
    P8: useRef<HTMLDivElement | null>(null),
    P9: useRef<HTMLDivElement | null>(null),
    P10: useRef<HTMLDivElement | null>(null),
    P11: useRef<HTMLDivElement | null>(null),
    P12: useRef<HTMLDivElement | null>(null),
    P13: useRef<HTMLDivElement | null>(null),
    P14: useRef<HTMLDivElement | null>(null),
    P15: useRef<HTMLDivElement | null>(null),
    P16: useRef<HTMLDivElement | null>(null),
  };
}
