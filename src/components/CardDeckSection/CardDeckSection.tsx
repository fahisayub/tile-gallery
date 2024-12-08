'use client';

import React, { useState, useRef } from 'react';
import { useSprings, animated, to as interpolate } from '@react-spring/web';
import { useDrag } from 'react-use-gesture';
import styles from './CardDeckSection.module.css';

const baseCards = [
  '/image/tiles/1.png',
  '/image/tiles/3.png',
  '/image/tiles/6.png',
  '/image/tiles/15.png',
  '/image/tiles/7.png',
  '/image/tiles/8.png',
  '/image/tiles/11.png',
  '/image/tiles/10.png',
  '/image/tiles/9.png',
];

const titles = [
  'Premium Floor Tiles',
  'Natural Stone Collection',
  'Designer Wall Tiles',
  'Outdoor Tiles',
  'Luxury Granite',
  'Modern Living Room Tiles',
  'Kitchen Collection',
];

const to = (i: number) => ({
  x: 0,
  y: i * -4,
  scale: 1,
  rot: -10 + Math.random() * 20,
  delay: i * 100,
});

const from = () => ({ x: 0, rot: 0, scale: 1.5, y: -1000 });

const trans = (r: number, s: number) =>
  `perspective(1500px) rotateX(30deg) rotateY(${r / 10}deg) rotateZ(${r}deg) scale(${s})`;

function Deck() {
  const [gone] = useState(() => new Set());
  const directions = useRef<{ [key: number]: number }>({});

  const [props, api] = useSprings(baseCards.length, i => ({
    ...to(i),
    from: from(),
  }));

  const bind = useDrag(({ args: [index], down, movement: [mx], direction: [xDir], velocity }) => {
    const trigger = velocity > 0.2;
    const dir = xDir < 0 ? -1 : 1;

    if (!down && trigger) {
      gone.add(index);
      directions.current[index] = dir;
    }

    api.start(i => {
      if (index !== i) return;
      const isGone = gone.has(index);
      const x = isGone ? (200 + window.innerWidth) * dir : down ? mx : 0;
      const rot = mx / 100 + (isGone ? dir * 10 * velocity : 0);
      const scale = down ? 1.1 : 1;
      return {
        x,
        rot,
        scale,
        delay: undefined,
        config: { friction: 50, tension: down ? 800 : isGone ? 200 : 500 },
      };
    });

    if (!down && gone.size === baseCards.length) {
      setTimeout(() => {
        const currentDirections = { ...directions.current };
        gone.clear();
        directions.current = {};

        api.start(i => {
          const dir = currentDirections[i] || 1;
          return {
            to: to(i),
            from: {
              x: (200 + window.innerWidth) * dir,
              rot: dir * 10 * velocity,
              scale: 1,
              y: i * -4
            },
            config: { friction: 50, tension: 500 }
          };
        });
      }, 600);
    }
  });

  return (
    <>
      {props.map(({ x, y, rot, scale }, i) => (
        <animated.div className={styles.deck} key={i} style={{ x, y }}>
          <animated.div
            {...bind(i)}
            className={styles.card}
            style={{
              transform: interpolate([rot, scale], trans),
              backgroundImage: `url(${baseCards[i]})`,
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 rounded-lg">
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <p className="text-white text-lg font-medium text-center">
                  {titles[i]}
                </p>
              </div>
            </div>
          </animated.div>
        </animated.div>
      ))}
    </>
  );
}

function CardDeckSection() {
  return (
    <div className={styles.container}>
      <Deck />
    </div>
  );
}

export default CardDeckSection; 