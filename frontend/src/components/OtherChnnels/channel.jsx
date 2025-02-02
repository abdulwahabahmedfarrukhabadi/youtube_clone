import ChannelHeader from "./channelHeader"
import ChannelTabs from "./channelTabs"
import ChannelContent from "./channelContent"
import { useParams } from "react-router-dom";
const Channel = () => {
    const { id } = useParams();
  console.log("Channel ID:", id);
  return (
    <div className="min-h-screen bg-gray-100">
        
      <ChannelHeader />
      <ChannelTabs />
      <ChannelContent />
    </div>
  )
}

export default Channel
