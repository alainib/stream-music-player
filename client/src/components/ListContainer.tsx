import List from '@mui/material/List';

const _styl = {
  width: '100%',
  //  bgcolor: 'background.paper',
  overflow: 'auto',
  position: 'relative',
  maxHeight: '80vh',
  marginBottom: '12px',
};

type ListContainerProps = {
  children: any;
  style: object;
  id?: string;
};

export default function ListContainer({ children, style, id, ...otherprops }: ListContainerProps) {
  return (
    <List
      sx={{
        ..._styl,
        ...style,
      }}
      {...otherprops}
    >
      {children}
    </List>
  );
}
