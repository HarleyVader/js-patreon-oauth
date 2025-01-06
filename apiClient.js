// apiClient.js
const axios = require('axios');

module.exports.getMembers = async (accessToken, campaignId) => {
  const response = await axios.get(`https://www.patreon.com/api/oauth2/v2/campaigns/${campaignId}/members`, {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Accept': 'application/vnd.api+json',
    },
    params: {
      include: 'address,currently_entitled_tiers,user',
      fields: {
        member: 'full_name,is_follower,last_charge_date,lifetime_support_cents,currently_entitled_amount_cents,patron_status',
        address: 'addressee,city,line_1,line_2,phone_number,postal_code,state',
        tier: 'amount_cents,created_at,description,discord_role_ids,edited_at,patron_count,published,published_at,requires_shipping,title,url',
      },
    },
  });

  return response.data;
};
