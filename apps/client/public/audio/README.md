# EverVale Audio Runtime Folder

Binary music/SFX files are intentionally not committed yet.

Canonical slot manifest:
`data/audio/v0.1/music.yaml`

Expected runtime layout:

```
public/audio/
  music/
    town_day.ogg
    town_evening.ogg
    rain.ogg
    threat_warning.ogg
    combat_light.ogg
    recovery.ogg
  sfx/
    ui/
    build/
    world/
    combat/
```

Agent rule:
- generated music is an asset draft until loop points, loudness and rights are checked;
- do not hard-code track URLs in UI components;
- preserve exact stable filenames from the manifest;
- keep stems/source prompts outside the runtime bundle.
