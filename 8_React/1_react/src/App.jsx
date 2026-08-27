import Avatar from "./components/Avatar"
import Profile from "./components/Profile"
import InputUser from "./components/InputUser"
import UserList from "./components/UserList"
import './App.css'

function App() {

  


  return (
    <>
      <Avatar image="https://slack-imgs.com/?c=1&o1=ro&url=https%3A%2F%2Fplus.unsplash.com%2Fpremium_photo-1678197937465-bdbc4ed95815%3Fw%3D500%26auto%3Dformat%26fit%3Dcrop%26q%3D60%26ixlib%3Drb-4.1.0%26ixid%3DM3wxMjA3fDB8MHxzZWFyY2h8NXx8JUVDJTgyJUFDJUVCJTlFJThDfGVufDB8fDB8fHww" isNew={true} />


      <Avatar image="https://slack-imgs.com/?c=1&o1=ro&url=https%3A%2F%2Fimages.unsplash.com%2Fphoto-1438761681033-6461ffad8d80%3Fq%3D80%26w%3D1170%26auto%3Dformat%26fit%3Dcrop%26ixlib%3Drb-4.1.0%26ixid%3DM3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%253D%253D" isNew={true} />

      <Profile image="https://slack-imgs.com/?c=1&o1=ro&url=https%3A%2F%2Fimages.unsplash.com%2Fphoto-1499952127939-9bbf5af6c51c%3Fw%3D500%26auto%3Dformat%26fit%3Dcrop%26q%3D60%26ixlib%3Drb-4.1.0%26ixid%3DM3wxMjA3fDB8MHxzZWFyY2h8MTJ8fCVFQyU4MiVBQyVFQiU5RSU4Q3xlbnwwfHwwfHx8MA%253D%253D" name="김사과" title="AI 개발자" isNew={false} />

      <Profile image="https://slack-imgs.com/?c=1&o1=ro&url=https%3A%2F%2Fimages.unsplash.com%2Fphoto-1500648767791-00dcc994a43e%3Fq%3D80%26w%3D687%26auto%3Dformat%26fit%3Dcrop%26ixlib%3Drb-4.1.0%26ixid%3DM3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%253D%253D" name="오렌지" title="백엔드 개발자" isNew={true} />
      <hr/>
      <InputUser />

      <hr/>
      <UserList/>
    </>
  )
}

export default App
