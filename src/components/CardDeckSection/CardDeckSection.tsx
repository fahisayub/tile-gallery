'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useSprings, animated, to as interpolate } from '@react-spring/web';
import styles from './CardDeckSection.module.css';

interface PinnedImage {
  _id: string;
  url: string;
  title: string;
}

const fallbackCards = [
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

const fallbackTitles = [
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
  const [cardOrder, setCardOrder] = useState<number[]>([]);
  const [cards, setCards] = useState<string[]>([]);
  const [titles, setTitles] = useState<string[]>([]);

  useEffect(() => {
    fetchPinnedImages();
  }, []);

  const fetchPinnedImages = async () => {
    try {
      const response = await fetch('/api/homepage-settings');
      const data = await response.json();
      
      if (data.success && data.settings.heroSection.pinnedImages?.length > 0) {
        const pinnedImages = data.settings.heroSection.pinnedImages;
        const imageUrls = pinnedImages.map((img: PinnedImage) => img.url);
        const imageTitles = pinnedImages.map((img: PinnedImage) => img.title || 'Stone Collection');
        
        setCards(imageUrls);
        setTitles(imageTitles);
        setCardOrder([...Array(imageUrls.length).keys()]);
      } else {
        // Use fallback images if no pinned images are found
        setCards(fallbackCards);
        setTitles(fallbackTitles);
        setCardOrder([...Array(fallbackCards.length).keys()]);
      }
    } catch (error) {
      console.error('Error fetching pinned images:', error);
      // Use fallback images on error
      setCards(fallbackCards);
      setTitles(fallbackTitles);
      setCardOrder([...Array(fallbackCards.length).keys()]);
    }
  };

  const [props, api] = useSprings(cards.length, i => ({
    ...to(i),
    from: from(),
    config: {
      mass: 1,
      tension: 180,
      friction: 20
    }
  }), [cards.length]);

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
    if (isAnimating || cards.length === 0) return;
    setIsAnimating(true);

    let currentIndex = cards.length - 1;

    const animate = () => {
      if (true) {
        const actualIndex = cardOrder[currentIndex];
        animateCard(actualIndex);
        currentIndex = (currentIndex - 1 + cards.length) % cards.length;
        timeoutRef.current = setTimeout(animate, 1700);
      }
    };

    timeoutRef.current = setTimeout(animate, 2200);
  };

  useEffect(() => {
    if (cards.length > 0) {
      startAnimation();
    }
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cards.length]);

  if (cards.length === 0) {
    return (
      <div className={styles.container}>
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-400">Loading images...</div>
        </div>
      </div>
    );
  }

  return (
    <>
      {props.map(({ x, y, rot, scale }, i) => (
        <animated.div
          className={styles.deck}
          key={i}
          style={{
            x,
            y,
            zIndex: cards.length - cardOrder.indexOf(i),
            position: 'absolute',
            transform: `translateY(${cardOrder.indexOf(i) * -4}px)`,
          }}
        >
          <animated.div
            className={styles.card}
            style={{
              transform: interpolate([rot, scale], trans),
              backgroundImage: `url(${cards[i]})`,
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