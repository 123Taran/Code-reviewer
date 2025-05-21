const generateDiceBearAvataaars = (seed) =>
  `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`;

const generateDiceBearBottts = (seed) =>
  `https://api.dicebear.com/7.x/bottts/svg?seed=${seed}`;

const generateDiceBearMicah = (seed) =>
  `https://api.dicebear.com/7.x/micah/svg?seed=${seed}`;

function randomSeed() {
  // generate a random 8-character string seed
  return Math.random().toString(36).substring(2, 10);
}

export const generateAvatar = () => {
  const data = [];

  for (let i = 0; i < 2; i++) {
    data.push(generateDiceBearAvataaars(randomSeed()));
  }
  for (let i = 0; i < 2; i++) {
    data.push(generateDiceBearBottts(randomSeed()));
  }
  for (let i = 0; i < 2; i++) {
    data.push(generateDiceBearMicah(randomSeed()));
  }

  return data;
};
