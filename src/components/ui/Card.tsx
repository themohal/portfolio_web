"use client";

import { HTMLAttributes, forwardRef } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className = "", hover = false, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`bg-white/5 border border-white/10 rounded-xl backdrop-blur-sm ${
          hover ? "hover:bg-white/10 hover:border-white/20 transition-all duration-300" : ""
        } ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = "Card";
export default Card;
