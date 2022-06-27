import { useRecoilState } from 'recoil';
import { modalState } from '../atom/modalAtom';

const CommentModal = () => {
    const [open, setOpen] = useRecoilState(modalState)
  return (
    <div>
        <h1>Leave a comment</h1>
        {open && <h2>The modal is open</h2>}
    </div>
  )
}
export default CommentModal