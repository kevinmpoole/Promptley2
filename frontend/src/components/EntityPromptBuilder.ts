/* ==============================
   Entity (Character) Prompt Builder
============================== */
const buildEntityPrompt = (attributes: Record<string, any>) => {
  const {
    name,
    title,
    species,
    gender,
    age,
    height,
    build,
    skin_tone,
    eye_color,
    hair_color,
    hairstyle,
    facial_hair,
    faceShape,
    eyeSpacing,
    jawWidth,
    noseLength,
    mouthSize,
    pose,
    expression,
    outfit,
    accessories,
    signature_item,
    style_keywords,
    role,
    personality_traits,
    backstory_snippet,
    world_affiliation,
    visual_notes,
  } = attributes;

  return `${name || "—"}, known as ${title || "—"}, is a ${species || "—"} of ${gender || "—"}, aged ${
    age || "—"
  }, standing ${height || "—"} inches tall with a ${build || "—"} physique. 
Their skin is ${skin_tone || "—"}, eyes are ${eye_color || "—"}, and hair is ${hair_color || "—"} styled in a ${
    hairstyle || "—"
  }. ${facial_hair || "—"} accents their face with a ${faceShape || "—"}, 
${eyeSpacing || "—"} eye spacing, ${jawWidth || "—"} jaw width, ${noseLength || "—"} nose length, and ${mouthSize || "—"} mouth size.

They are usually seen ${pose || "in a neutral stance"}, with an expression of ${
    expression || "a calm demeanor"
  }. Their outfit consists of ${outfit || "standard attire"}, and they often carry ${accessories || "no visible accessories"}.
Their signature item is ${signature_item || "none"}. The style is defined by ${style_keywords || "nondescript fashion"}.

They are a ${role || "character"} in the story, known for their ${
    personality_traits || "unique qualities"
  }. A bit of their backstory: ${backstory_snippet || "—"}. They hail from ${
    world_affiliation || "an unknown land"
  }.

Additional visual notes: ${visual_notes || "none"}.
`;
};

/* ==============================
   Prompt Builders for Other Card Types
============================== */

const buildWorldPrompt = (attributes: Record<string, any>) => {
  const {
    name,
    climate,
    terrain,
    dominant_culture,
    tech_level,
    key_locations,
    notable_figures,
    visual_notes,
  } = attributes;

  return `${name}: A world with ${climate || "varied climate"} and ${terrain || "diverse terrain"}. 
    Dominant culture: ${dominant_culture || "—"}.
    Technology level: ${tech_level || "—"}.
    Key locations include: ${key_locations || "unknown"}.
    Notable figures: ${notable_figures || "undisclosed"}.
    Visual style: ${visual_notes || "natural"}.`;
};

const buildScenePrompt = (attributes: Record<string, any>) => {
  const {
    name,
    location,
    time_of_day,
    weather,
    mood,
    key_objects,
    visual_notes,
  } = attributes;

  return `${name}: Set in ${location || "an unknown place"} during ${time_of_day || "an undefined time of day"}. 
    Weather conditions are ${weather || "neutral"}.
    Mood: ${mood || "—"}.
    Key objects present: ${key_objects || "none"}.
    Visual style: ${visual_notes || "natural"}.`;
};

const buildPropPrompt = (attributes: Record<string, any>) => {
  const {
    name,
    material,
    size,
    weight,
    condition,
    magical_properties,
    origin,
    visual_notes,
  } = attributes;

  return `${name}: A ${material || "—"} prop, approximately ${size || "—"} in size, weighing ${weight || "—"}. 
    Condition: ${condition || "—"}.
    Magical properties: ${magical_properties || "—"}.
    Origin: ${origin || "unknown"}.
    Visual style: ${visual_notes || "natural"}.`;
};

const buildShotPrompt = (attributes: Record<string, any>) => {
  const {
    name,
    camera_angle,
    focus_subject,
    lighting,
    motion,
    special_effects,
    visual_notes,
  } = attributes;

  return `${name}: Shot with a ${camera_angle || "standard"} camera angle, focusing on ${focus_subject || "the main subject"}. 
    Lighting is ${lighting || "standard"} with ${motion || "no specific motion"}.
    Special effects: ${special_effects || "none"}.
    Visual style: ${visual_notes || "natural"}.`;
};

const buildEventPrompt = (attributes: Record<string, any>) => {
  const {
    name,
    event_type,
    participants,
    location,
    outcome,
    visual_notes,
  } = attributes;

  return `${name}: A ${event_type || "—"} event held at ${location || "an undisclosed location"}. 
    Participants include: ${participants || "unknown"}.
    Outcome: ${outcome || "unresolved"}.
    Visual style: ${visual_notes || "natural"}.`;
};

const buildFramePrompt = (attributes: Record<string, any>) => {
  const {
    name,
    perspective,
    mood,
    objects_in_view,
    visual_notes,
  } = attributes;

  return `${name}: A frame with ${perspective || "—"} perspective. 
    Mood: ${mood || "neutral"}.
    Objects in view: ${objects_in_view || "none"}.
    Visual style: ${visual_notes || "natural"}.`;
};

/* ==============================
   Export All Builders
============================== */
export {
  buildEntityPrompt,
  buildWorldPrompt,
  buildScenePrompt,
  buildPropPrompt,
  buildShotPrompt,
  buildEventPrompt,
  buildFramePrompt,
};