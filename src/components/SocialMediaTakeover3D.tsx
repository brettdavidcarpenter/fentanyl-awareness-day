
import { Canvas } from '@react-three/fiber';
import { Text, Float, OrbitControls } from '@react-three/drei';
import { useRef, useState, useEffect, Suspense } from 'react';
import { Mesh, Group } from 'three';
import { useFrame } from '@react-three/fiber';

// Realistic social media post data
const socialPosts = [
  {
    platform: 'Facebook',
    username: 'Sarah M.',
    avatar: '👩‍💼',
    content: 'Did you know 2mg of fentanyl can be lethal? That\'s smaller than a grain of salt. Please share to save lives. #FentanylAwareness #August21',
    likes: '47',
    comments: '12',
    shares: '8',
    position: [-3, 1, 0] as [number, number, number],
    color: '#ffffff'
  },
  {
    platform: 'Instagram',
    username: 'awareness_advocate',
    avatar: '🏥',
    content: 'Carrying naloxone saves lives 💊\nTest strips detect fentanyl 🧪\nEvery story matters 💙\n#FacingFentanyl #SaveLives',
    likes: '234',
    comments: '45',
    shares: '67',
    position: [0, 2.5, 0] as [number, number, number],
    color: '#ffffff'
  },
  {
    platform: 'Twitter',
    username: '@FentanylFacts',
    avatar: '⚠️',
    content: 'FACT: Fentanyl is 50x stronger than heroin. One pill can kill. Share this thread to spread awareness. #FentanylAwareness #August21st',
    likes: '156',
    comments: '23',
    shares: '89',
    position: [3.2, 1, 0] as [number, number, number],
    color: '#ffffff'
  },
  {
    platform: 'TikTok',
    username: 'SafetyFirst2024',
    avatar: '🎵',
    content: 'Real talk about fentanyl awareness 📢\nEvery voice matters\nJoin the movement Aug 21st',
    likes: '1.2K',
    comments: '234',
    shares: '456',
    position: [-1.8, -1.2, 0] as [number, number, number],
    color: '#ffffff'
  },
  {
    platform: 'LinkedIn',
    username: 'Dr. Jennifer Kim',
    avatar: '👨‍⚕️',
    content: 'As healthcare professionals, we must lead fentanyl awareness efforts. Join colleagues nationwide on August 21st.',
    likes: '89',
    comments: '15',
    shares: '34',
    position: [2, -1.5, 0] as [number, number, number],
    color: '#ffffff'
  }
];

interface SocialPostCardProps {
  post: typeof socialPosts[0];
  index: number;
}

function SocialPostCard({ post, index }: SocialPostCardProps) {
  const meshRef = useRef<Mesh>(null);
  const groupRef = useRef<Group>(null);

  // Gentle floating animation
  useFrame((state) => {
    if (groupRef.current) {
      // Subtle floating motion only - no rotation
      groupRef.current.position.y = post.position[1] + Math.sin(state.clock.elapsedTime * 0.8 + index * 0.3) * 0.15;
    }
  });

  return (
    <group ref={groupRef} position={post.position}>
      <Float speed={0.5} rotationIntensity={0} floatIntensity={0.2}>
        {/* White card background with shadow effect */}
        <mesh ref={meshRef} position={[0, 0, -0.02]}>
          <boxGeometry args={[2.4, 2.8, 0.08]} />
          <meshStandardMaterial color="#ffffff" />
        </mesh>
        
        {/* Platform header */}
        <Text
          position={[-1, 1.2, 0.05]}
          fontSize={0.12}
          color="#1a1a1a"
          anchorX="left"
          anchorY="middle"
          font="/fonts/inter-medium.woff"
        >
          {post.platform}
        </Text>
        
        {/* User info */}
        <Text
          position={[-1, 1, 0.05]}
          fontSize={0.1}
          color="#333333"
          anchorX="left"
          anchorY="middle"
        >
          {post.avatar} {post.username}
        </Text>
        
        {/* Post content */}
        <Text
          position={[-1, 0.2, 0.05]}
          fontSize={0.08}
          color="#1a1a1a"
          anchorX="left"
          anchorY="top"
          maxWidth={2.2}
          textAlign="left"
          lineHeight={1.3}
        >
          {post.content}
        </Text>
        
        {/* Engagement stats */}
        <Text
          position={[-1, -0.8, 0.05]}
          fontSize={0.07}
          color="#666666"
          anchorX="left"
          anchorY="middle"
        >
          👍 {post.likes}   💬 {post.comments}   🔄 {post.shares}
        </Text>
        
        {/* Bottom border accent */}
        <mesh position={[0, -1.35, 0.05]}>
          <boxGeometry args={[2.2, 0.02, 0.01]} />
          <meshStandardMaterial color="#e0e0e0" />
        </mesh>
      </Float>
    </group>
  );
}

function Scene() {
  return (
    <>
      {/* Optimized lighting for white cards */}
      <ambientLight intensity={1.2} />
      <directionalLight position={[5, 5, 2]} intensity={0.8} castShadow />
      <directionalLight position={[-5, 5, 2]} intensity={0.4} />
      
      {socialPosts.map((post, index) => (
        <SocialPostCard key={post.platform} post={post} index={index} />
      ))}
      
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        maxPolarAngle={Math.PI / 2}
        minPolarAngle={Math.PI / 2}
        autoRotate={false}
        enableRotate={true}
        rotateSpeed={0.3}
      />
    </>
  );
}

function LoadingFallback() {
  return (
    <div className="h-96 w-full flex items-center justify-center">
      <div className="text-gray-400 text-sm">Loading posts...</div>
    </div>
  );
}

function ErrorFallback() {
  return (
    <div className="h-96 w-full flex items-center justify-center">
      <div className="text-center text-gray-400">
        <div className="text-sm">Posts visualization unavailable</div>
      </div>
    </div>
  );
}

const SocialMediaTakeover3D = () => {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <section className="py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="h-96 w-full">
            <ErrorFallback />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="h-96 w-full">
          <Suspense fallback={<LoadingFallback />}>
            <Canvas
              camera={{ position: [0, 0, 8], fov: 60 }}
              style={{ background: 'transparent' }}
              onError={(error) => {
                console.error('Canvas error:', error);
                setHasError(true);
              }}
            >
              <Scene />
            </Canvas>
          </Suspense>
        </div>
      </div>
    </section>
  );
};

export default SocialMediaTakeover3D;
