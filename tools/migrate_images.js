const { createClient } = require('@supabase/supabase-js');
const fetch = require('node-fetch');
const path = require('path');

// Node-only migration script. Run with `node tools/migrate_images.js`.

// Supabase configuration
const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables');
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

async function downloadImage(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to download image from ${url}: ${response.statusText}`);
  }
  return response.buffer();
}

async function uploadImageToSupabase(bucketName, filePath, imageBuffer, contentType) {
  const { data, error } = await supabase.storage.from(bucketName).upload(filePath, imageBuffer, {
    contentType,
    upsert: true,
  });

  if (error) {
    throw new Error(`Failed to upload image to Supabase Storage: ${error.message}`);
  }

  const publicUrl = supabase.storage.from(bucketName).getPublicUrl(filePath).data.publicUrl;
  return publicUrl;
}

async function migrateImages() {
  console.log('Starting image migration...');

  // Fetch all products and their variants
  const { data: products, error: productsError } = await supabase
    .from('products')
    .select('id, image_url, variants(id, image_url)');

  if (productsError) {
    console.error('Error fetching products:', productsError.message);
    return;
  }

  for (const product of products ?? []) {
    // Migrate product image
    if (product.image_url && product.image_url.startsWith('http') && !product.image_url.includes('supabase.co/storage')) {
      try {
        console.log(`Migrating product image for product ID ${product.id}: ${product.image_url}`);
        const imageBuffer = await downloadImage(product.image_url);
        const fileExtension = path.extname(product.image_url).toLowerCase();
        const fileName = `product-${product.id}${fileExtension}`;
        const contentType = `image/${fileExtension.substring(1)}`; // e.g., image/jpeg, image/png

        const newImageUrl = await uploadImageToSupabase('products', fileName, imageBuffer, contentType);

        const { error: updateError } = await supabase
          .from('products')
          .update({ image_url: newImageUrl })
          .eq('id', product.id);

        if (updateError) {
          console.error(`Error updating product image URL for product ID ${product.id}: ${updateError.message}`);
        } else {
          console.log(`Successfully migrated product image for product ID ${product.id} to ${newImageUrl}`);
        }
      } catch (e) {
        console.error(`Failed to migrate product image for product ID ${product.id}: ${e.message}`);
      }
    }

    // Migrate variant images
    for (const variant of product.variants ?? []) {
      if (variant.image_url && variant.image_url.startsWith('http') && !variant.image_url.includes('supabase.co/storage')) {
        try {
          console.log(`Migrating variant image for variant ID ${variant.id} (product ID ${product.id}): ${variant.image_url}`);
          const imageBuffer = await downloadImage(variant.image_url);
          const fileExtension = path.extname(variant.image_url).toLowerCase();
          const fileName = `variant-${variant.id}${fileExtension}`;
          const contentType = `image/${fileExtension.substring(1)}`;

          const newImageUrl = await uploadImageToSupabase('variants', fileName, imageBuffer, contentType);

          const { error: updateError } = await supabase
            .from('variants')
            .update({ image_url: newImageUrl })
            .eq('id', variant.id);

          if (updateError) {
            console.error(`Error updating variant image URL for variant ID ${variant.id}: ${updateError.message}`);
          } else {
            console.log(`Successfully migrated variant image for variant ID ${variant.id} to ${newImageUrl}`);
          }
        } catch (e) {
          console.error(`Failed to migrate variant image for variant ID ${variant.id}: ${e.message}`);
        }
      }
    }
  }

  console.log('Image migration completed.');
}

migrateImages();
