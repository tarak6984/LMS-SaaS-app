// Performance optimization utilities

/**
 * Lazy load components with dynamic imports
 */
export function lazyImport<T extends Record<string, any>>(
  factory: () => Promise<T>,
  name: keyof T
) {
  return Object.create({
    [Symbol.toStringTag]: 'Module',
    [name]: React.lazy(() => factory().then(module => ({ default: module[name] }))),
  });
}

/**
 * Debounce function to limit the rate of function calls
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout>;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
}

/**
 * Throttle function to limit function execution to once per specified interval
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let lastCall = 0;
  
  return (...args: Parameters<T>) => {
    const now = Date.now();
    if (now - lastCall >= delay) {
      lastCall = now;
      func(...args);
    }
  };
}

/**
 * Intersection Observer hook for lazy loading
 */
import { useEffect, useRef, useState } from 'react';

export function useIntersectionObserver(
  threshold = 0.1,
  rootMargin = '0px'
) {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [hasIntersected, setHasIntersected] = useState(false);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
        if (entry.isIntersecting && !hasIntersected) {
          setHasIntersected(true);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [threshold, rootMargin, hasIntersected]);

  return { ref, isIntersecting, hasIntersected };
}

/**
 * Optimized image component with lazy loading
 */
import Image, { ImageProps } from 'next/image';
import { forwardRef } from 'react';

interface OptimizedImageProps extends Omit<ImageProps, 'src'> {
  src: string;
  fallback?: string;
  lazy?: boolean;
}

export const OptimizedImage = forwardRef<HTMLImageElement, OptimizedImageProps>(
  ({ src, fallback, lazy = true, ...props }, ref) => {
    const { ref: observerRef, hasIntersected } = useIntersectionObserver();
    
    if (lazy && !hasIntersected) {
      return (
        <div
          ref={observerRef}
          className={`bg-gray-200 animate-pulse ${props.className || ''}`}
          style={{
            width: props.width,
            height: props.height,
          }}
        />
      );
    }

    return (
      <Image
        ref={ref}
        src={src}
        {...props}
        placeholder="blur"
        blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGBkRMxUf/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
        onError={(e) => {
          if (fallback) {
            (e.target as HTMLImageElement).src = fallback;
          }
        }}
      />
    );
  }
);

OptimizedImage.displayName = 'OptimizedImage';

/**
 * Local Storage with error handling and expiration
 */
export class OptimizedStorage {
  static set(key: string, value: any, expirationHours = 24) {
    try {
      const item = {
        value,
        expiry: new Date().getTime() + (expirationHours * 60 * 60 * 1000),
      };
      localStorage.setItem(key, JSON.stringify(item));
    } catch (error) {
      console.warn('Failed to save to localStorage:', error);
    }
  }

  static get(key: string) {
    try {
      const item = localStorage.getItem(key);
      if (!item) return null;

      const parsed = JSON.parse(item);
      
      // Check if expired
      if (new Date().getTime() > parsed.expiry) {
        localStorage.removeItem(key);
        return null;
      }

      return parsed.value;
    } catch (error) {
      console.warn('Failed to get from localStorage:', error);
      return null;
    }
  }

  static remove(key: string) {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.warn('Failed to remove from localStorage:', error);
    }
  }
}

/**
 * Performance monitoring utilities
 */
export function measurePerformance(name: string, fn: () => void) {
  const start = performance.now();
  fn();
  const end = performance.now();
  console.log(`${name} took ${end - start} milliseconds`);
}

export function reportWebVitals(metric: any) {
  // Report to analytics service
  console.log('Web Vital:', metric);
  
  // Example: Send to Google Analytics
  if (typeof window !== 'undefined' && 'gtag' in window) {
    (window as any).gtag('event', metric.name, {
      custom_parameter_1: metric.value,
      custom_parameter_2: metric.id,
    });
  }
}