-- =============================================================================
-- Seed Data — Aurélia Fragrance
-- Jalankan di Supabase SQL Editor setelah migration init_schema.
-- =============================================================================

-- ---------------------------------------------------------------------------
-- CATEGORIES
-- ---------------------------------------------------------------------------
insert into public.categories (name, slug) values
  ('Floral',    'floral'),
  ('Oriental',  'oriental'),
  ('Fresh',     'fresh'),
  ('Woody',     'woody'),
  ('Gift Sets', 'gift-sets')
on conflict (slug) do nothing;

-- ---------------------------------------------------------------------------
-- PRODUCTS
-- ---------------------------------------------------------------------------
insert into public.products
  (category_id, name, slug, description, price, compare_at_price, stock,
   images, top_notes, middle_notes, base_notes,
   is_best_seller, is_limited_edition, is_active)
select
  c.id, p.name, p.slug, p.description, p.price, p.compare_at_price, p.stock,
  p.images, p.top_notes, p.middle_notes, p.base_notes,
  p.is_best_seller, p.is_limited_edition, p.is_active
from (
  values
    ('floral', 'Midnight Rose', 'midnight-rose',
     'A captivating floral fragrance that unfolds like a midnight garden in full bloom. Bulgarian rose absolute meets velvety patchouli for an unforgettable impression.',
     185.00, null, 50,
     '{}'::text[],
     '{"Bergamot","Pink Pepper","Blackcurrant"}'::text[],
     '{"Bulgarian Rose","Jasmine","Iris"}'::text[],
     '{"Patchouli","Amber","Musk"}'::text[],
     true, false, true),

    ('oriental', 'Amber Velvet', 'amber-velvet',
     'Wrap yourself in warmth with Amber Velvet. Rich amber resin blended with vanilla and sandalwood creates a velvety trail that lingers.',
     210.00, 250.00, 35,
     '{}'::text[],
     '{"Cinnamon","Saffron","Cardamom"}'::text[],
     '{"Amber","Vanilla","Cedar"}'::text[],
     '{"Sandalwood","Benzoin","Tonka"}'::text[],
     true, false, true),

    ('oriental', 'Crystal Saffron', 'crystal-saffron',
     'A luminous composition built around the world''s most precious spice. Crystal Saffron shimmers with golden floralcy and a warm resinous base.',
     195.00, null, 40,
     '{}'::text[],
     '{"Saffron","Neroli","Mandarin"}'::text[],
     '{"Rose","Orris","Honey"}'::text[],
     '{"Ambergris","Cedar","Leather"}'::text[],
     true, false, true),

    ('fresh', 'Ocean Silk', 'ocean-silk',
     'Dive into serenity with Ocean Silk. A fresh aquatic breeze carrying white florals and clean musk.',
     175.00, null, 60,
     '{}'::text[],
     '{"Sea Salt","Bergamot","Lemon"}'::text[],
     '{"Lily of the Valley","Rose","Jasmine"}'::text[],
     '{"White Musk","Amber","Cedar"}'::text[],
     true, false, true),

    ('oriental', 'Golden Oud', 'golden-oud',
     'The rarest agarwood meets golden amber in this opulent fragrance. Golden Oud is a statement of refined taste and timeless luxury.',
     230.00, null, 20,
     '{}'::text[],
     '{"Oud","Saffron","Bergamot"}'::text[],
     '{"Rose","Cypriol","Papyrus"}'::text[],
     '{"Amber","Leather","Sandalwood"}'::text[],
     true, true, true),

    ('floral', 'Luminous Jasmine', 'luminous-jasmine',
     'A radiant tribute to jasmine in all its forms. Luminous Jasmine captures the flower at dawn.',
     190.00, null, 45,
     '{}'::text[],
     '{"Mandarin","Pear","Bergamot"}'::text[],
     '{"Jasmine","Ylang-Ylang","Orange Blossom"}'::text[],
     '{"Musk","Sandalwood","Vanilla"}'::text[],
     true, false, true),

    ('woody', 'Phantom Leather', 'phantom-leather',
     'Bold, enigmatic, effortlessly cool. Phantom Leather weaves smoky birch tar with supple leather accord.',
     245.00, 290.00, 25,
     '{}'::text[],
     '{"Birch","Juniper","Black Pepper"}'::text[],
     '{"Leather","Violet","Saffron"}'::text[],
     '{"Oud","Patchouli","Incense"}'::text[],
     true, false, true),

    ('fresh', 'Silver Musk', 'silver-musk',
     'Pure minimalism in a bottle. Silver Musk is a clean, contemporary skin scent built around translucent musks.',
     200.00, null, 55,
     '{}'::text[],
     '{"Aldehydes","Pear","Bergamot"}'::text[],
     '{"Musk","Iris","Lily of the Valley"}'::text[],
     '{"Ambroxan","Cedar","White Musk"}'::text[],
     true, false, true),

    ('woody', 'Noir Tobacco', 'noir-tobacco',
     'An intoxicating blend of dark tobacco leaf, honeyed rum, and smoky woods. Noir Tobacco is for those who embrace the night.',
     220.00, null, 15,
     '{}'::text[],
     '{"Tobacco","Rum","Prune"}'::text[],
     '{"Leather","Cinnamon","Clove"}'::text[],
     '{"Birch","Oud","Vanilla"}'::text[],
     false, true, true),

    ('fresh', 'Solar Neroli', 'solar-neroli',
     'Capturing the essence of a sun-drenched Mediterranean garden. Solar Neroli sparkles with citrus brightness.',
     180.00, null, 50,
     '{}'::text[],
     '{"Neroli","Bergamot","Lemon"}'::text[],
     '{"Orange Blossom","Jasmine","Honeysuckle"}'::text[],
     '{"Musk","Amber","Cedar"}'::text[],
     false, false, true),

    ('floral', 'Velvet Iris', 'velvet-iris',
     'Iris takes center stage in this powdered masterpiece. Velvet Iris wraps the regal orris root in soft suede and warm woods.',
     235.00, 280.00, 12,
     '{}'::text[],
     '{"Violet","Bergamot","Carrot Seed"}'::text[],
     '{"Iris","Rose","Heliotrope"}'::text[],
     '{"Suede","Sandalwood","Vanilla"}'::text[],
     false, true, true),

    ('woody', 'Ember Oud', 'ember-oud',
     'Like embers glowing in the dark, Ember Oud smolders with smoky agarwood, roasted coffee, and a whisper of vanilla.',
     260.00, null, 18,
     '{}'::text[],
     '{"Coffee","Bergamot","Saffron"}'::text[],
     '{"Oud","Leather","Cypriol"}'::text[],
     '{"Vanilla","Amber","Sandalwood"}'::text[],
     false, true, true),

    ('gift-sets', 'His & Her', 'his-her',
     'Midnight Rose and Phantom Leather presented together in a luxury gift box. The perfect gesture for two.',
     340.00, 430.00, 10,
     '{}'::text[],
     '{"Bergamot","Pink Pepper","Blackcurrant"}'::text[],
     '{"Rose","Jasmine","Leather"}'::text[],
     '{"Patchouli","Amber","Oud"}'::text[],
     false, false, true),

    ('gift-sets', 'The Explorer', 'the-explorer',
     'Travel-sized editions of Ocean Silk, Crystal Saffron, and Silver Musk in a curated discovery set.',
     275.00, null, 15,
     '{}'::text[],
     '{"Bergamot","Sea Salt","Saffron"}'::text[],
     '{"Lily of the Valley","Rose","Orris"}'::text[],
     '{"White Musk","Amber","Cedar"}'::text[],
     false, false, true),

    ('gift-sets', 'Velvet Night', 'velvet-night',
     'Golden Oud, Amber Velvet, and Noir Tobacco in a handcrafted wooden case. For those who command the night.',
     520.00, 680.00, 5,
     '{}'::text[],
     '{"Oud","Saffron","Cinnamon"}'::text[],
     '{"Amber","Rose","Tobacco"}'::text[],
     '{"Leather","Sandalwood","Vanilla"}'::text[],
     false, true, true)
) as p(cat_slug, name, slug, description, price, compare_at_price, stock,
        images, top_notes, middle_notes, base_notes,
        is_best_seller, is_limited_edition, is_active)
join public.categories c on c.slug = p.cat_slug
on conflict (slug) do update set
  price              = excluded.price,
  compare_at_price   = excluded.compare_at_price,
  stock              = excluded.stock,
  description        = excluded.description,
  top_notes          = excluded.top_notes,
  middle_notes       = excluded.middle_notes,
  base_notes         = excluded.base_notes,
  is_best_seller     = excluded.is_best_seller,
  is_limited_edition = excluded.is_limited_edition,
  updated_at         = now();
