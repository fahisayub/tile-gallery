'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useSprings, animated, to as interpolate } from '@react-spring/web';
import styles from './CardDeckSection.module.css';

const baseCards = [
  '/image/stones/9.png',
  '/image/stones/10.png',
  '/image/stones/6.png',
  '/image/stones/7.png',
  '/image/stones/2.png',
  '/image/stones/20.png',
  '/image/stones/2.png',
  '/image/stones/17.png',
  '/image/stones/16.png',
  '/image/stones/5.png',
  '/image/stones/4.png',
  '/image/stones/1.png',
];

const titles = [
  'Kitchen Collection',
  'Modern Living Room Tiles',
  'Luxury Granite',
  'Outdoor Tiles',
  'Designer Wall Tiles',
  'Natural Stone Collection',
  'Premium Floor Tiles',
].reverse();

const to = (i: number) => ({
  x: 0,
  y: i * -4,
  scale: 1,
  rot: 0,
  delay: i * 100,
  immediate: true,
});

const from = () => ({ 
  x: 0, 
  rot: 0, 
  scale: 1,
  y: 0 
});

const trans = (r: number, s: number) =>
  `perspective(1500px) rotateX(30deg) rotateY(${Math.min(r / 10, 15)}deg) rotateZ(${Math.min(r, 20)}deg) scale(${s})`;

function Deck() {
  const [gone] = useState(() => new Set());
  const [isAnimating, setIsAnimating] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [cardOrder, setCardOrder] = useState([...Array(baseCards.length).keys()]);

  const [props, api] = useSprings(baseCards.length, i => ({
    ...to(i),
    from: from(),
    config: {
      mass: 1,
      tension: 180,
      friction: 20
    }
  }));

  const animateCard = (index: number) => {
    const dir = 1;
    gone.add(index);

    api.start(i => {
      if (index !== i) return;
      const x = (200 + window.innerWidth) * dir;
      const rot = dir * 15;
      return {
        x,
        rot,
        scale: 1,
        delay: undefined,
        config: { 
          friction: 50, 
          tension: 200, 
          duration: 1500 
        },
        onRest: () => {
          setCardOrder(prevOrder => {
            const newOrder = [...prevOrder];
            const orderIndex = newOrder.indexOf(index);
            const [removedCard] = newOrder.splice(orderIndex, 1);
            newOrder.unshift(removedCard);
            return newOrder;
          });

          api.start(j => {
            if (j === index) {
              return {
                x: 0,
                y: 0,
                rot: 0,
                scale: 1,
                immediate: true,
              };
            }
          });

          gone.delete(index);
        },
      };
    });
  };

  const startAnimation = () => {
    if (isAnimating) return;
    setIsAnimating(true);

    let currentIndex = baseCards.length - 1;

    const animate = () => {
      if (true) {
        const actualIndex = cardOrder[currentIndex];
        animateCard(actualIndex);
        currentIndex = (currentIndex - 1 + baseCards.length) % baseCards.length;
        timeoutRef.current = setTimeout(animate, 1700);
      }
    };

    timeoutRef.current = setTimeout(animate, 2200);
  };

  useEffect(() => {
    startAnimation();
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {props.map(({ x, y, rot, scale }, i) => (
        <animated.div
          className={styles.deck}
          key={i}
          style={{
            x,
            y,
            zIndex: baseCards.length - cardOrder.indexOf(i),
            position: 'absolute',
            transform: `translateY(${cardOrder.indexOf(i) * -4}px)`,
          }}
        >
          <animated.div
            className={styles.card}
            style={{
              transform: interpolate([rot, scale], trans),
              backgroundImage: `url(${baseCards[i]})`,
              touchAction: 'none',
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