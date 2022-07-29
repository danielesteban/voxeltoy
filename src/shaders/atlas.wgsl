// Atlas compute pass

// Noise functions
// noise3(p: vec3<f32>) -> f32
// simplexNoise3(v: vec3<f32>) -> f32

// Color helpers
// hsl2Rgba(h : f32, s: f32, l: f32) -> vec4<f32>

// Variables
// atlas.count : i32
// atlas.width : i32
// atlas.height : i32

fn getColorAt(texture : i32, pixel : vec2<i32>) -> vec4<f32> {
  var h : f32 = f32(texture) / f32(atlas.count);
  var s : f32 = 0.5;
  var l : f32 = 0.5;
  if (
    pixel.x == 0 || pixel.x == (atlas.width - 1)
    || pixel.y == 0 || pixel.y == (atlas.height - 1)
  ) {
    l = min(l * 1.1, 1);
  }
  return hsl2Rgba(h, s, l);
}
