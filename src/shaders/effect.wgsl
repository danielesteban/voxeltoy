// Effect pass

// Textures
// var colorTexture : texture_2d<f32>;
// var normalTexture : texture_2d<f32>;
// var positionTexture : texture_2d<f32>;

struct Effect {
  color : vec3<f32>,
  intensity : f32,
  depthScale : f32,
  normalScale : f32,
}

const effect : Effect = Effect(
  vec3<f32>(0, 0, 0),
  0.3,
  0.5,
  0.5,
);

const offset : vec3<i32> = vec3<i32>(1, 1, 0);

fn edgesDepth(pixel : vec2<i32>) -> f32 {
  var pixelCenter : f32 = textureLoad(positionTexture, pixel, 0).z;
  var pixelLeft : f32 = textureLoad(positionTexture, pixel - offset.xz, 0).z;
  var pixelRight : f32 = textureLoad(positionTexture, pixel + offset.xz, 0).z;
  var pixelUp : f32 = textureLoad(positionTexture, pixel + offset.zy, 0).z;
  var pixelDown : f32 = textureLoad(positionTexture, pixel - offset.zy, 0).z;
  return (
    abs(pixelLeft    - pixelCenter) 
    + abs(pixelRight - pixelCenter) 
    + abs(pixelUp    - pixelCenter) 
    + abs(pixelDown  - pixelCenter) 
  ) * effect.depthScale;
}

fn edgesNormal(pixel : vec2<i32>) -> f32 {
  var pixelCenter : vec3<f32> = textureLoad(normalTexture, pixel, 0).xyz;
  var pixelLeft : vec3<f32> = textureLoad(normalTexture, pixel - offset.xz, 0).xyz;
  var pixelRight : vec3<f32> = textureLoad(normalTexture, pixel + offset.xz, 0).xyz;
  var pixelUp : vec3<f32> = textureLoad(normalTexture, pixel + offset.zy, 0).xyz;
  var pixelDown : vec3<f32> = textureLoad(normalTexture, pixel - offset.zy, 0).xyz;
  var edge : vec3<f32> = (
    abs(pixelLeft    - pixelCenter)
    + abs(pixelRight - pixelCenter) 
    + abs(pixelUp    - pixelCenter) 
    + abs(pixelDown  - pixelCenter)
  );
  return (edge.x + edge.y + edge.z) * effect.normalScale;
}

fn getColor(pixel : vec2<i32>, size : vec2<i32>, time : f32) -> vec4<f32> {
  var color : vec3<f32> = textureLoad(colorTexture, pixel, 0).xyz;
  color = mix(color, effect.color, clamp(max(edgesDepth(pixel), edgesNormal(pixel)), 0, 1) * effect.intensity);
  return vec4<f32>(color, 1);
}
