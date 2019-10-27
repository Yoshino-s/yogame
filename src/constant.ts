const constant = {
  DefaultValues: {
    CanvasWidth: 400,
    CanvasHeight: 400,
    MAX_TEXTURE_NUMBER: 16,
  },
  Manager: {
    ResourceManager: {
      ImageExtensionName: [ ".png", ".jpg", ],
      RawExtensionName: [ ".txt", "", ],
    },
  },
  Layer: {
    DEFAULT: 1,
    RESERVED_0: 0.9,
    RRSERVED_1: 0.8,
    RESERVED_2: 0.7,
    BACKGROUND: 0.6,
    TILE_0:0.5,
    TILE_1:0.4,
    TILE_2:0.3,
    ENTITY_0:0.2,
    ENTITY_1:0.1,
    ENTITY_2: 0,
    UI_0:-0.1,
    UI_1:-0.2,
    UI_2:-0.3,
    RESERVED_3: -0.4,
    RRSERVED_4: -0.5,
    RESERVED_5: -0.6,
  },
};

export default constant;