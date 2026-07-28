require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing env vars NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function migrate() {
  console.log('Starting migration...');
  const { data: players, error } = await supabase.from('interested_players').select('id, player_name').is('user_id', null);
  if (error) {
    return console.error('Error fetching players:', error);
  }

  console.log(`Found ${players.length} players without user_id`);

  for (const player of players) {
    const email = `${player.player_name.toLowerCase().replace(/[^a-z0-9]/g, '')}@campeonato.com`;
    console.log(`Creating user for ${player.player_name} -> ${email}`);
    
    const { data: authData, error: authErr } = await supabase.auth.admin.createUser({
      email: email,
      password: 'abd123',
      email_confirm: true
    });

    if (authErr) {
      if (authErr.message.includes('already registered')) {
          console.log(`User ${email} already exists, fetching their ID...`);
          // Find the existing user by email? We don't have an easy way unless we list users.
          // This is a simple migration, so we just log and continue.
          console.error(`Please manually link or clear existing auth user for ${email}`);
      } else {
          console.error('Error creating user:', authErr.message);
      }
      continue;
    }

    const { error: updateErr } = await supabase.from('interested_players').update({ user_id: authData.user.id }).eq('id', player.id);
    if (updateErr) {
        console.error(`Failed to update player ${player.player_name} with user_id:`, updateErr.message);
    } else {
        console.log(`Successfully linked ${player.player_name}`);
    }
  }
  console.log('Migration finished.');
}
migrate();
