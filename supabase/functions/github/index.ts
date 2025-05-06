import { createClient } from 'npm:@supabase/supabase-js@2.39.7';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

const GITHUB_TOKEN = Deno.env.get('GITHUB_TOKEN');
const GITHUB_API = 'https://api.github.com';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const path = url.pathname.split('/github/')[1];

    if (!GITHUB_TOKEN) {
      throw new Error('GitHub token not configured');
    }

    const headers = {
      'Authorization': `token ${GITHUB_TOKEN}`,
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'Supabase-Edge-Function'
    };

    let response;

    switch (path) {
      case 'repos':
        response = await fetch(`${GITHUB_API}/user/repos`, { headers });
        break;
      
      case 'create':
        if (req.method !== 'POST') {
          throw new Error('Method not allowed');
        }
        
        const { name, description, isPrivate } = await req.json();
        
        response = await fetch(`${GITHUB_API}/user/repos`, {
          method: 'POST',
          headers: {
            ...headers,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name,
            description,
            private: isPrivate,
            auto_init: true
          }),
        });
        break;

      default:
        throw new Error('Invalid endpoint');
    }

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'GitHub API error');
    }

    return new Response(JSON.stringify(data), {
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders,
      },
    });

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      }
    );
  }
});