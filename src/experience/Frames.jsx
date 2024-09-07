import * as THREE from "three";
import { frames } from "../constants";
import { useTexture } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

const lerp = (start, end, t) => {
  return start * (1 - t) + end * t;
};

const Frames = () => {
  const { camera } = useThree();
  camera.lookAt(0, 0, 1.5);
  return (
    <>
      {frames.map((frame, index) => (
        <Frame key={index} position={[0, 0, index - 5]} {...frame} />
      ))}
    </>
  );
};

export default Frames;

const Frame = (props) => {
  const [isDragging, setIsDragging] = useState(false);
  const { url } = props;
  const texture = useTexture(url);
  const frameRef = useRef();
  const scrollOffset = useRef(0);
  const speed = 0.02;

  const total = frames.length;
  const max = total / 2;

  const animationRef = useRef();

  useEffect(() => {
    const scale = isDragging ? 1 : 1.1;
    if (animationRef.current) {
      animationRef.current.kill();
    }
    animationRef.current = gsap.to(frameRef.current.scale, {
      x: scale,
      y: scale,
      z: scale,
      duration: 0.5,
    });
    const handleWheel = (event) => {
      scrollOffset.current += event.deltaY * speed;
    };

    const handleTouchMove = (event) => {
      scrollOffset.current +=
        Math.max(event.touches[0].clientY, event.touches[0].clientX) * speed;
    };

    const handleDrag = (event) => {
      if (isDragging) {
        const movement =
          Math.max(Math.abs(event.movementY), Math.abs(event.movementX)) *
          speed *
          0.5;
        const direction =
          Math.abs(event.movementY) > Math.abs(event.movementX)
            ? Math.sign(event.movementY)
            : -Math.sign(event.movementX);
        scrollOffset.current += movement * direction;
      }
    };

    const handleMouseDown = () => {
      setIsDragging(true);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    window.addEventListener("wheel", handleWheel);
    window.addEventListener("touchmove", handleTouchMove);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mousemove", handleDrag);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mousemove", handleDrag);
      window.removeEventListener("mouseup", handleMouseUp);
      animationRef.current.kill();
    };
  }, [isDragging]);

  useFrame((state, delta) => {
    const elapsedTime = state.clock.getElapsedTime();
    frameRef.current.position.z = lerp(
      frameRef.current.position.z,
      frameRef.current.position.z + scrollOffset.current,
      0.1
    );

    scrollOffset.current = lerp(scrollOffset.current, 0, 0.1);

    const offset = frameRef.current.position.z % max;
    if (frameRef.current.position.z > max) {
      frameRef.current.position.z = -max + offset;
    } else if (frameRef.current.position.z < -max) {
      frameRef.current.position.z = max + offset;
    }
  });
  return (
    <mesh ref={frameRef} {...props}>
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial side={THREE.DoubleSide} map={texture} />
    </mesh>
  );
};
