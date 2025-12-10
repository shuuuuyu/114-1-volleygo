// supabase/functions/send-reminders/index.ts

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// Deno 新版寫法
Deno.serve(async (req) => {
  try {
    console.log('🔄 開始檢查待發送的提醒...')

    const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

    // 建立 Supabase client
    const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

    // 查詢待發送的提醒
    const now = new Date().toISOString()
    
    const { data: reminders, error: remindersError } = await supabaseAdmin
      .from('email_reminders')
      .select('*')
      .eq('sent', false)
      .lte('remind_at', now)
      .limit(50)

    if (remindersError) {
      console.error('❌ 查詢提醒失敗:', remindersError)
      throw remindersError
    }

    console.log(`📧 找到 ${reminders?.length || 0} 筆待發送提醒`)

    if (!reminders || reminders.length === 0) {
      return new Response(
        JSON.stringify({ message: '沒有待發送的提醒' }),
        { 
          status: 200,
          headers: { 'Content-Type': 'application/json' } 
        }
      )
    }

    // 取得使用者 Email
    const userIds = [...new Set(reminders.map(r => r.user_id))]
    const { data: usersData, error: usersError } = await supabaseAdmin.auth.admin.listUsers()

    if (usersError) {
      console.error('❌ 查詢使用者失敗:', usersError)
      throw usersError
    }

    const userEmailMap = new Map(
      usersData.users.map(u => [u.id, u.email])
    )

    // 發送每一筆提醒
    const results = await Promise.all(
      reminders.map(async (reminder) => {
        try {
          const match = reminder.match_data
          const userEmail = userEmailMap.get(reminder.user_id)

          if (!userEmail) {
            console.error(`❌ 提醒 ${reminder.id} 沒有使用者 Email`)
            return { id: reminder.id, success: false, error: 'No email' }
          }

          // 發送 Email
          const emailResult = await sendEmail(RESEND_API_KEY!, userEmail, match)

          if (emailResult.success) {
            // 標記為已發送
            await supabaseAdmin
              .from('email_reminders')
              .update({ sent: true })
              .eq('id', reminder.id)

            console.log(`✅ 已發送提醒給 ${userEmail}`)
            return { id: reminder.id, success: true }
          } else {
            console.error(`❌ 發送失敗:`, emailResult.error)
            return { id: reminder.id, success: false, error: emailResult.error }
          }
        } catch (error: any) {
          console.error(`❌ 處理提醒時發生錯誤:`, error)
          return { id: reminder.id, success: false, error: error.message }
        }
      })
    )

    const successCount = results.filter(r => r.success).length
    console.log(`🎉 成功發送 ${successCount}/${results.length} 筆提醒`)

    return new Response(
      JSON.stringify({
        message: `已處理 ${results.length} 筆提醒`,
        success: successCount,
        failed: results.length - successCount,
        results
      }),
      { 
        status: 200,
        headers: { 'Content-Type': 'application/json' } 
      }
    )

  } catch (error: any) {
    console.error('❌ Edge Function 執行失敗:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { 'Content-Type': 'application/json' } 
      }
    )
  }
})

// 發送 Email 函數
async function sendEmail(apiKey: string, to: string, match: any) {
  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        from: 'VolleyGo <onboarding@resend.dev>',
        to: [to],
        subject: `🏐 比賽提醒：${match.homeTeam} vs ${match.awayTeam}`,
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
              .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
              .match-info { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #39ff14; }
              .team-vs { font-size: 24px; font-weight: bold; text-align: center; margin: 20px 0; color: #003366; }
              .details { margin: 15px 0; }
              .details p { margin: 8px 0; }
              .cta-button { display: inline-block; background: #39ff14; color: #003366; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; margin-top: 20px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>🏐 VolleyGo 比賽提醒</h1>
              </div>
              <div class="content">
                <p>您好！</p>
                <p>您收藏的比賽即將開始：</p>
                
                <div class="match-info">
                  <div class="team-vs">
                    ${match.homeTeam} <span style="color: #999;">VS</span> ${match.awayTeam}
                  </div>
                  
                  <div class="details">
                    <p><strong>📅 時間：</strong>${match.date} ${match.time}</p>
                    <p><strong>📍 地點：</strong>${match.location || '待公告'}</p>
                    <p><strong>🏆 聯賽：</strong>${match.league === 'TPVL' ? '職業排球聯盟 (TPVL)' : '企業排球聯賽 (TVL)'}</p>
                    <p><strong>🏐 組別：</strong>${match.gender === 'male' ? '男子組' : '女子組'}</p>
                  </div>
                </div>

                <p style="text-align: center;">
                  <a href="${match.url || 'https://localhost:5173/matches'}" class="cta-button">
                    查看賽事詳情
                  </a>
                </p>

                <p style="margin-top: 30px; color: #666; font-size: 14px;">
                  祝您觀賽愉快！🎉
                </p>
              </div>
            </div>
          </body>
          </html>
        `
      })
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || 'Email 發送失敗')
    }

    return { success: true, data }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}