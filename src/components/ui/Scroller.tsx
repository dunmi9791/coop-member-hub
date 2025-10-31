import ScrollContainer from 'react-indiana-drag-scroll'


const Scroller = (props) => {
  return (
    <div>
       <ScrollContainer vertical={false} className="header-links mb-2 scroller px-2" style={{overflow:'scroll'}}>
        {props.children}
      </ScrollContainer>
    </div>
  )
}

export default Scroller
