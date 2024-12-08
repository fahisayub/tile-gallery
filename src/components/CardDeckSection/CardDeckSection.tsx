'use client';

import React, { useState } from 'react';
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
  const [props, api] = useSprings(baseCards.length, () => ({
    ...to(0),
    from: from(),
  }));

  const bind = useDrag(({ args: [index], down, movement: [mx], direction: [xDir], velocity }) => {
    const trigger = velocity > 0.2;
    const dir = xDir < 0 ? -1 : 1;
    if (!down && trigger) gone.add(index);

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

    if (!down && gone.size === baseCards.length)
      setTimeout(() => {
        gone.clear();
        api.start(i => to(i));
      }, 600);
  });

  return (
    <>
      {props.map(({ x, y, rot, scale }, i) => (
        <animated.div className={styles.deck} key={i} style={{ x, y }}>
          <animated.div
            {...bind(i)}
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
    <section className="relative py-20 mt-20 overflow-hidden justify-center bg-gradient-to-br from-stone-100 to-amber-50">
      <div className="absolute inset-0 bg-[url('/noise.png')] mix-blend-soft-light opacity-50" />
      <div className="container mx-auto px-4 relative">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-stone-800 to-stone-600 bg-clip-text text-transparent">
            Explore Our Collection
          </h2>
          <p className="text-lg text-stone-600 mt-4">
            Swipe or drag to explore our premium tiles and stones
          </p>
        </div>
        
        <div className="relative h-[600px] z-10">
          <div className={styles.container}>
            <Deck />
          </div>
        </div>
      </div>
    </section>
  );
}

export default CardDeckSection; 