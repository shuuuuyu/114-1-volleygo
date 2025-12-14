import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
// 在檔案最上方加入 sleep 函數
function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

Deno.serve(async (req) => {
  try {
    console.log('🔄 開始檢查待發送的提醒...')

    const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

    if (!RESEND_API_KEY) {
      throw new Error('缺少 RESEND_API_KEY 環境變數')
    }

    const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

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
        JSON.stringify({ 
          success: true,
          message: '沒有待發送的提醒' 
        }),
        { 
          status: 200,
          headers: { 'Content-Type': 'application/json' } 
        }
      )
    }

    const userIds = [...new Set(reminders.map(r => r.user_id))]
    const { data: usersData, error: usersError } = await supabaseAdmin.auth.admin.listUsers()

    if (usersError) {
      console.error('❌ 查詢使用者失敗:', usersError)
      throw usersError
    }

    const userEmailMap = new Map(
      usersData.users.map(u => [u.id, u.email])
    )

    // ⭐ 改用順序處理，不要用 Promise.all
    const results = []
    
    for (let i = 0; i < reminders.length; i++) {
      const reminder = reminders[i]
      
      try {
        const match = reminder.match_data
        const userEmail = userEmailMap.get(reminder.user_id)

        if (!userEmail) {
          console.error(`❌ 提醒 ${reminder.id} 沒有使用者 Email`)
          results.push({ id: reminder.id, success: false, error: 'No email' })
          continue
        }

        const emailResult = await sendEmail(RESEND_API_KEY!, userEmail, match)

        if (emailResult.success) {
          // 標記為已發送 + 記錄發送時間
          await supabaseAdmin
            .from('email_reminders')
            .update({ 
              sent: true,
              sent_at: new Date().toISOString()
            })
            .eq('id', reminder.id)

          console.log(`✅ 已發送提醒給 ${userEmail}`)
          results.push({ id: reminder.id, success: true })
        } else {
          console.error(`❌ 發送失敗:`, emailResult.error)
          results.push({ id: reminder.id, success: false, error: emailResult.error })
        }

        // ⭐ 每封信之間延遲 600ms (每秒最多 1.6 封，低於限制)
        if (i < reminders.length - 1) {
          await sleep(600)
        }

      } catch (error: any) {
        console.error(`❌ 處理提醒時發生錯誤:`, error)
        results.push({ id: reminder.id, success: false, error: error.message })
      }
    }

    const successCount = results.filter(r => r.success).length
    console.log(`🎉 成功發送 ${successCount}/${results.length} 筆提醒`)

    return new Response(
      JSON.stringify({
        success: true,
        message: `已處理 ${results.length} 筆提醒`,
        successCount,
        failedCount: results.length - successCount,
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
      JSON.stringify({ 
        success: false,
        error: error.message 
      }),
      { 
        status: 500, 
        headers: { 'Content-Type': 'application/json' } 
      }
    )
  }
})

async function sendEmail(apiKey: string, to: string, match: any) {
  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        from: 'VolleyGo <noreply@nightcode.me>',
        to: [to],
        subject: `🏐 比賽提醒：${match.homeTeam} vs ${match.awayTeam}`,
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #e91e63 0%, #f06292 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
              .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
              .match-info { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #e91e63; }
              .team-vs { font-size: 24px; font-weight: bold; text-align: center; margin: 20px 0; color: #e91e63; }
              .details { margin: 15px 0; }
              .details p { margin: 8px 0; }
              .cta-button { display: inline-block; background: #e91e63; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; margin-top: 20px; }
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
                    <p><strong>🏆 聯賽：</strong>${match.league === 'TPVL' ? '台灣職業排球聯盟' : '企業排球聯賽'}</p>
                    <p><strong>🏐 組別：</strong>${match.gender === 'male' ? '男子組' : '女子組'}</p>
                  </div>
                </div>

                <p style="text-align: center;">
                  <a href="${match.url || 'https://volleygo.vercel.app/matches'}" class="cta-button">
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