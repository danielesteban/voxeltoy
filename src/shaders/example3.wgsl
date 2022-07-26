fn getValueAt(pos : vec3<f32>) -> f32 {
  var p : vec3<f32> = pos + vec3<f32>(0, 0, round(time * 100));
  var h : f32 = abs(simplexNoise3(p * 0.01)) * volume.size.y;
  if (pos.y > h) {
    return 0;
  }
  return 1 + abs(simplexNoise3(p * -0.001)) * 254;
}
