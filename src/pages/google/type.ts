
export const getStyle = (theme: string) => ({
  backgroundColor: theme === 'dark' ? 'rgb(66, 133, 244)' : '#fff',
  display: 'inline-flex',
  alignItems: 'center',
  color: theme === 'dark' ? '#fff' : 'rgba(0, 0, 0, 1)',
  boxShadow: '0 2px 2px 0 rgba(0, 0, 0, .24), 0 0 1px 0 rgba(0, 0, 0, .24)',
  padding: 0,
  borderRadius: 2,
  border: '1px solid transparent',
  fontSize: 18,
  width: "100%",
  height: "40px",
  fontWeight: '500',
  fontFamily: 'Roboto, sans-serif'
});
export const getActiveStyle = (theme: string) => ({
  cursor: 'pointer',
  backgroundColor: theme === 'dark' ? '#3367D6' : '#eee',
  color: theme === 'dark' ? '#fff' : 'rgba(0, 0, 0, .54)',
  opacity: 1
});

export const hoveredStyle = {
  cursor: 'pointer',
  opacity: 0.9
};

export const getDefaultStyle = ({ theme, disabled, active, hovered, initialStyle, activeStyle, disabledStyle }) => (() => {
  const styles = { disabled: disabledStyle, active: activeStyle, hovered: hoveredStyle };
  if (disabled) {
    return Object.assign({}, initialStyle, disabledStyle)
  }
  if (active) {
    return Object.assign({}, initialStyle, activeStyle)
  }
  if (hovered) {
    return Object.assign({}, initialStyle, hoveredStyle)
  }
  return initialStyle
})();