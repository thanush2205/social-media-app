import { Avatar } from '@mui/material';
import { getInitials } from '../utils/format';

/**
 * User avatar with an auto-generated colored fallback when no image/avatar is set.
 */
export default function UserAvatar({ name = '', src = '', size = 40, color, ...rest }) {
  let backgroundColor = color;
  if (!backgroundColor) {
    // Deterministic color from the name so it stays consistent per user.
    backgroundColor = `hsl(${(name.length * 47) % 360}, 55%, 45%)`;
  }

  return src ? (
    <Avatar src={src} sx={{ width: size, height: size }} {...rest} />
  ) : (
    <Avatar
      sx={{
        width: size,
        height: size,
        bgcolor: backgroundColor,
        fontSize: size * 0.4,
        fontWeight: 600,
      }}
      {...rest}
    >
      {getInitials(name)}
    </Avatar>
  );
}