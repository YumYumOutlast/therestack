import { Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing'
import Free from './pages/Free'
import Starter from './pages/Starter'
import Playbook from './pages/Playbook'
import Operator from './pages/Operator'
import Profile from './pages/Profile'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/free" element={<Free />} />
      <Route path="/starter" element={<Starter />} />
      <Route path="/playbook" element={<Playbook />} />
      <Route path="/operator" element={<Operator />} />
      <Route path="/profile" element={<Profile />} />
    </Routes>
  )
}
