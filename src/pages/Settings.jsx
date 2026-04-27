import { useState } from 'react'
import { Save, User, Bell, Shield, Palette, Globe, CheckCircle } from 'lucide-react'

function useSettings() {
  const [settings, setSettings] = useState(() => JSON.parse(localStorage.getItem('nexus_settings') || JSON.stringify({
    notifications: { priceAlerts: true, news: false, weeklyReport: true },
    display: { theme: 'dark', chartStyle: 'area', refreshRate: '2500' },
    privacy: { showPortfolio: true, showBalance: true },
  })))
  const save = (next) => { setSettings(next); localStorage.setItem('nexus_settings', JSON.stringify(next)) }
  const update = (section, key, val) => save({ ...settings, [section]: { ...settings[section], [key]: val } })
  return { settings, update }
}

function Toggle({ checked, onChange }) {
  return (
    <button className={'settings-toggle' + (checked ? ' on' : '')} onClick={() => onChange(!checked)}>
      <div className="toggle-knob" />
    </button>
  )
}

function Section({ title, icon: Icon, children }) {
  return (
    <div className="settings-section">
      <div className="settings-section-header">
        <Icon size={16} />
        <span>{title}</span>
      </div>
      <div className="settings-section-body">{children}</div>
    </div>
  )
}

function Row({ label, desc, children }) {
  return (
    <div className="settings-row">
      <div className="settings-row-info">
        <div className="settings-row-label">{label}</div>
        {desc && <div className="settings-row-desc">{desc}</div>}
      </div>
      <div className="settings-row-control">{children}</div>
    </div>
  )
}

export default function Settings() {
  const { settings, update } = useSettings()
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    localStorage.setItem('nexus_settings', JSON.stringify(settings))
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <div className="page-content">
      <div className="page-heading-row">
        <div className="page-heading">
          <h1>Settings</h1>
          <p>Manage your dashboard preferences</p>
        </div>
        <button className={'btn-primary' + (saved ? ' saved' : '')} onClick={handleSave}>
          {saved ? <><CheckCircle size={15} /> Saved!</> : <><Save size={15} /> Save Changes</>}
        </button>
      </div>

      <Section title="Notifications" icon={Bell}>
        <Row label="Price Alerts" desc="Get notified when your price alerts are triggered">
          <Toggle checked={settings.notifications.priceAlerts} onChange={v => update('notifications','priceAlerts',v)} />
        </Row>
        <Row label="Market News" desc="Daily crypto market summaries">
          <Toggle checked={settings.notifications.news} onChange={v => update('notifications','news',v)} />
        </Row>
        <Row label="Weekly Report" desc="Portfolio performance report every Monday">
          <Toggle checked={settings.notifications.weeklyReport} onChange={v => update('notifications','weeklyReport',v)} />
        </Row>
      </Section>

      <Section title="Display" icon={Palette}>
        <Row label="Chart Style" desc="How price charts are rendered">
          <select
            className="settings-select"
            value={settings.display.chartStyle}
            onChange={e => update('display','chartStyle',e.target.value)}
          >
            <option value="area">Area Chart</option>
            <option value="line">Line Chart</option>
            <option value="candle">Candlestick</option>
          </select>
        </Row>
        <Row label="Price Refresh Rate" desc="How often live prices update">
          <select
            className="settings-select"
            value={settings.display.refreshRate}
            onChange={e => update('display','refreshRate',e.target.value)}
          >
            <option value="1000">1 second</option>
            <option value="2500">2.5 seconds</option>
            <option value="5000">5 seconds</option>
            <option value="10000">10 seconds</option>
          </select>
        </Row>
        <Row label="Currency" desc="All prices shown in South African Rand">
          <div className="settings-static">🇿🇦 ZAR (R)</div>
        </Row>
      </Section>

      <Section title="Privacy" icon={Shield}>
        <Row label="Show Portfolio Value" desc="Display portfolio total on dashboard">
          <Toggle checked={settings.privacy.showPortfolio} onChange={v => update('privacy','showPortfolio',v)} />
        </Row>
        <Row label="Show Balance in Header" desc="Show total balance in the top bar">
          <Toggle checked={settings.privacy.showBalance} onChange={v => update('privacy','showBalance',v)} />
        </Row>
      </Section>

      <Section title="Region" icon={Globe}>
        <Row label="Country" desc="Your trading region">
          <div className="settings-static">🇿🇦 South Africa</div>
        </Row>
        <Row label="Timezone" desc="Used for chart timestamps">
          <div className="settings-static">SAST (UTC+2)</div>
        </Row>
        <Row label="Language" desc="">
          <div className="settings-static">English (ZA)</div>
        </Row>
      </Section>
    </div>
  )
}
