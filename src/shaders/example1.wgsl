// VoxelToy

// SDF primitives
// sdBox(p : vec3<f32>, r : vec3<f32>) -> f32
// sdCapsule(p : vec3<f32>, r : vec3<f32>) -> f32
// sdEllipsoid(p : vec3<f32>, r : vec3<f32>) -> f32
// sdSphere(p : vec3<f32>, r : f32) -> f32
// sdTorus(p : vec3<f32>, r : vec2<f32>) -> f32

// SDF operations
// opUnion(d1 : f32, d2 : f32) -> f32
// opSubstraction(d1 : f32, d2 : f32) -> f32
// opSmoothUnion(d1 : f32, d2 : f32, k : f32) -> f32
// opSmoothSubstraction(d1 : f32, d2 : f32, k : f32) -> f32

// Noise functions
// noise3(p: vec3<f32>) -> f32
// simplexNoise3(v: vec3<f32>) -> f32

// Rotation helpers
// rotateX(rad : f32) -> mat3x3<f32>
// rotateY(rad : f32) -> mat3x3<f32>
// rotateZ(rad : f32) -> mat3x3<f32>

// Variables
// time : f32
// volume.size : vec3<f32>
// volume.center : vec3<f32>

fn distanceToScene(pos : vec3<f32>, time : f32) -> f32 {
  var origin : vec3<f32> = pos - volume.center;
  var t : f32 = sin(time * 2);
  var size : f32 = volume.size.x * (0.25 + t * 0.01);
  return opSmoothUnion(
    sdSphere(origin - vec3<f32>(size * (0.6 * t * -1), size * 0.2 * t * -1, 0), size),
    sdSphere(origin - vec3<f32>(size * (0.6 * t), size * 0.2 * t, 0), size),
    10
  );
}

fn getValueAt(pos : vec3<f32>, time : f32) -> f32 {
  if (distanceToScene(pos, time) > 0.01) {
    return 0;
  }
  return 1 + abs(simplexNoise3(pos * 0.01)) * 254;
}
