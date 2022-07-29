fn distanceToScene(pos : vec3<f32>, time : f32) -> f32 {
  var origin : vec3<f32> = pos - volume.center;
  var r : mat3x3<f32> = rotateX(PI * -0.5);
  return opUnion(
    sdTorus(
      r * origin,
      vec2<f32>(volume.size.x * 0.3, volume.size.x * 0.1)
    ),
    sdTorus(
      r * rotateY(time) * origin,
      vec2<f32>(volume.size.x * 0.1, volume.size.x * (0.02 + sin(time * 10) * 0.01))
    )
  );
}

fn getValueAt(pos : vec3<f32>, time : f32) -> f32 {
  if (distanceToScene(pos, time) > 0.01) {
    return 0;
  }
  return 1 + abs(simplexNoise3(pos * 0.01)) * 254;
}
