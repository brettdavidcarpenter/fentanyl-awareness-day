
import { Canvas } from '@react-three/fiber';
import { Text, Float, OrbitControls } from '@react-three/drei';
import { useRef, useState, useEffect } from 'react';
import { Mesh, Group } from 'three';
import { useFrame } from '@react-three/fiber';

// Social media platform data
const socialPlatforms = [
  {
    name: 'Facebook',
    color: '#1877F2',
    position: [-3, 1, 0] as [number, number, number],
    messages: [
      '💔 Fentanyl is 50x more potent than heroin',
      '🚨 2 mg of fentanyl can be lethal',
      '💊 Test strips save lives',
      '🏥 Have naloxone nearby'
    ]
  },
  {
    name: 'Instagram',
    color: '#E4405F',
    position: [0, 2, 0] as [number, number, number],
    messages: [
      'Share your story 📱',
      'Spread awareness 🔥',
      'Save lives together 💪',
      'August 21st - Take Action 📅'
    ]
  },
  {
    name: 'Twitter/X',
    color: '#1DA1F2',
    position: [3, 1, 0] as [number, number, number],
    messages: [
      '#FacingFentanyl',
      'Every voice matters',
      'Prevention saves lives',
      'Join the movement'
    ]
  },
  {
    name: 'TikTok',
    color: '#FF0050',
    position: [-1.5, -1, 0] as [number, number, number],
    messages: [
      'Real talk about fentanyl',
      'Education goes viral',
      'Your story matters',
      'Aug 21 - Post for change'
    ]
  },
  {
    name: 'LinkedIn',
    color: '#0A66C2',
    position: [1.5, -1, 0] as [number, number, number],
    messages: [
      'Workplace awareness',
      'Professional responsibility',
      'Community action',
      'Making a difference'
    ]
  }
];

interface SocialCardProps {
  platform: typeof socialPlatforms[0];
  index: number;
}

function SocialCard({ platform, index }: SocialCardProps) {
  const meshRef = useRef<Mesh>(null);
  const groupRef = useRef<Group>(null);
  const [messageIndex, setMessageIndex] = useState(0);

  // Rotate messages every 3 seconds with staggered timing
  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % platform.messages.length);
    }, 3000 + index * 500); // Staggered timing

    return () => clearInterval(interval);
  }, [platform.messages.length, index]);

  // Animation loop
  useFrame((state) => {
    if (groupRef.current) {
      // Floating motion
      groupRef.current.position.y = platform.position[1] + Math.sin(state.clock.elapsedTime + index) * 0.2;
      
      // Gentle rotation
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5 + index) * 0.1;
    }
  });

  return (
    <group ref={groupRef} position={platform.position}>
      <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.3}>
        {/* Card background */}
        <mesh ref={meshRef}>
          <boxGeometry args={[2, 1.2, 0.1]} />
          <meshStandardMaterial color={platform.color} />
        </mesh>
        
        {/* Platform name */}
        <Text
          position={[0, 0.3, 0.06]}
          fontSize={0.15}
          color="white"
          anchorX="center"
          anchorY="middle"
          font="/fonts/inter-bold.woff"
        >
          {platform.name}
        </Text>
        
        {/* Awareness message */}
        <Text
          position={[0, -0.1, 0.06]}
          fontSize={0.12}
          color="white"
          anchorX="center"
          anchorY="middle"
          maxWidth={1.8}
          textAlign="center"
          font="/fonts/inter-regular.woff"
        >
          {platform.messages[messageIndex]}
        </Text>
        
        {/* Call to action */}
        <Text
          position={[0, -0.4, 0.06]}
          fontSize={0.08}
          color="#E0E0E0"
          anchorX="center"
          anchorY="middle"
          maxWidth={1.8}
          textAlign="center"
          font="/fonts/inter-regular.woff"
        >
          Join the movement • Aug 21
        </Text>
      </Float>
    </group>
  );
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <pointLight position={[0, 0, 5]} intensity={0.5} />
      
      {socialPlatforms.map((platform, index) => (
        <SocialCard key={platform.name} platform={platform} index={index} />
      ))}
      
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        maxPolarAngle={Math.PI / 2}
        minPolarAngle={Math.PI / 2}
        autoRotate
        autoRotateSpeed={0.5}
      />
    </>
  );
}

const SocialMediaTakeover3D = () => {
  return (
    <section className="py-16 bg-gradient-to-r from-slate-900 via-blue-900 to-blue-700">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            The Social Media Takeover
          </h2>
          <p className="text-lg text-blue-200 mb-2">
            Thousands of voices, one powerful message
          </p>
          <p className="text-gray-300">
            See how your posts will join a nationwide movement on August 21st
          </p>
        </div>
        
        <div className="h-96 w-full">
          <Canvas
            camera={{ position: [0, 0, 8], fov: 50 }}
            style={{ background: 'transparent' }}
          >
            <Scene />
          </Canvas>
        </div>
        
        <div className="text-center mt-8">
          <p className="text-blue-200 text-sm">
            Interactive 3D preview • Your posts will create real impact
          </p>
        </div>
      </div>
    </section>
  );
};

export default SocialMediaTakeover3D;
