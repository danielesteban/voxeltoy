fn distanceToScene(pos : vec3<f32>) -> f32 {
  if (sdSphere(pos - volume.center, volume.size.x * 0.35) > 0.01) {
    return 1;
  }
  var id : f32 = noise3(floor(pos / 32));
  var p : vec3<f32> = (pos % 32) - 16;
  var t : f32 = sin((time + id) * 4);
  var d : f32;
  if (floor(id * 10) % 2 == 0) {
    d = sdSphere(p, t * 4 + 8);
  } else {
    d = sdBox(p, vec3<f32>(t * 4 + 8));
  }
  return opSmoothSubstraction(
    opSmoothSubstraction(
      d,
      sdBox(p, vec3<f32>(4, 4, 12)),
      1
    ),
    sdBox(p, vec3<f32>(12, 4, 4)),
    1
  );
}

fn getValueAt(pos : vec3<f32>) -> f32 {
  if (distanceToScene(pos) > 0.01) {
    return 0;
  }
  return 1 + abs(simplexNoise3(floor(pos / 32))) * 254;
}
