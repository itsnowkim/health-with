import React from 'react';
import { FontAwesome } from '@expo/vector-icons';
import { COLORS, SIZES } from '../constants';

export const Check = () => {
  return (
    <FontAwesome
      name="check"
      style={{ transform: [{ scaleX: 1.5 }, { scaleY: 1.5 }] }}
    />
  );
};
export const ColorCheck = ({ color }) => {
  return (
    <FontAwesome
      name="check"
      color={color}
      style={{
        transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }],
        marginRight: 20,
      }}
    />
  );
};

export const TrashCan = () => {
  return (
    <FontAwesome
      name="trash"
      color={COLORS.gray}
      style={{
        transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }],
        marginRight: 10,
      }}
    />
  );
};

export const Fire = () => {
  return (
    <FontAwesome
      name="fire"
      color={COLORS.primary}
      style={{
        transform: [{ scaleX: 1.5 }, { scaleY: 1.5 }],
        marginRight: 10,
      }}
    />
  );
};

export const Wrench = () => {
  return (
    <FontAwesome
      name="wrench"
      color={COLORS.primary}
      style={{
        transform: [{ scaleX: 1.5 }, { scaleY: 1.5 }],
        marginRight: 10,
      }}
    />
  );
};

export const AngleDown = () => {
  return (
    <FontAwesome
      name="angle-down"
      style={{
        transform: [{ scaleX: 1.5 }, { scaleY: 1.5 }],
      }}
    />
  );
};

export const AngleUp = () => {
  return (
    <FontAwesome
      name="angle-up"
      style={{
        transform: [{ scaleX: 1.5 }, { scaleY: 1.5 }],
      }}
    />
  );
};

export const Minus = () => {
  return (
    <FontAwesome
      name="minus"
      style={{ transform: [{ scaleX: 1 }, { scaleY: 0.5 }] }}
    />
  );
};

export const Plus = () => {
  return (
    <FontAwesome
      name="plus"
      color={COLORS.primary}
      style={{ transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }] }}
    />
  );
};
