import React, { useCallback, useEffect, useState, useRef } from "react";
import c from "./priceFilter.module.css";
import { Dash, PlayFill } from "@styled-icons/bootstrap";

const MultiRangeSlider = ({ min, max, onChange }) => {
  const [minVal, setMinVal] = useState(min);
  const [maxVal, setMaxVal] = useState(max);
  const minValRef = useRef(min);
  const maxValRef = useRef(max);
  const range = useRef(null);

  // Convert to percentage
  const getPercent = useCallback(
    (value) => Math.round(((value - min) / (max - min)) * 100),
    [min, max]
  );

  // Set width of the range to decrease from the left side
  useEffect(() => {
    const minPercent = getPercent(minVal);
    const maxPercent = getPercent(maxValRef.current);

    if (range.current) {
      range.current.style.left = `${minPercent}%`;
      range.current.style.width = `${maxPercent - minPercent}%`;
    }
  }, [minVal, getPercent]);

  // Set width of the range to decrease from the right side
  useEffect(() => {
    const minPercent = getPercent(minValRef.current);
    const maxPercent = getPercent(maxVal);

    if (range.current) {
      range.current.style.width = `${maxPercent - minPercent}%`;
    }
  }, [maxVal, getPercent]);

  function updatePriceRange() {
    onChange({ min: minVal, max: maxVal });
  }

  return (
    <div className={c.container}>
      <input
        type="range"
        min={min}
        max={max}
        value={minVal}
        onChange={(event) => {
          const value = Math.min(Number(event.target.value), maxVal - 1);
          setMinVal(value);
          minValRef.current = value;
        }}
        className={`${c.thumb} ${c.thumb_left}`}
        style={{ zIndex: minVal > max - 100 ? "5" : "3" }}
      />
      <input
        type="range"
        min={min}
        max={max}
        value={maxVal}
        onChange={(event) => {
          const value = Math.max(Number(event.target.value), minVal + 1);
          setMaxVal(value);
          maxValRef.current = value;
        }}
        className={`${c.thumb} ${c.thumb_right}`}
      />

      <div className={c.slider}>
        <div className={c.slider__track} />
        <div ref={range} className={c.slider__range} />
      </div>
      <div className={c.input}>
        <div className={c.slider__left_value}>
          <input
            type="number"
            value={minVal}
            min={min}
            max={max}
            className={c.num}
            onChange={(event) => {
              const value = Math.min(
                +event.target.value < +min ? +min : +event.target.value,
                maxVal - 1
              );
              setMinVal(value);
              minValRef.current = value;
            }}
          />
        </div>
        <Dash width={15} height={15} />
        <div className={c.slider__right_value}>
          <input
            type="number"
            value={maxVal}
            min={min}
            max={max}
            className={c.num}
            onChange={(event) => {
              const value = Math.max(
                +event.target.value > +max ? +max : +event.target.value,
                minVal + 1
              );
              setMaxVal(value);
              maxValRef.current = value;
            }}
          />
        </div>
        <button className="btn" onClick={updatePriceRange}>
          <PlayFill width={20} height={20} />
        </button>
      </div>
    </div>
  );
};

export default MultiRangeSlider;
