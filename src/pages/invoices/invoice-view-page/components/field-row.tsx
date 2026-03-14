import { Stack, Typography } from '@mui/material';

interface FieldRowProps {
  readonly label: string;
  readonly value: string;
}

const FieldRow = ({ label, value }: FieldRowProps): JSX.Element => (
  <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" spacing={1}>
    <Typography color="text.secondary">{label}</Typography>
    <Typography fontWeight={600}>{value}</Typography>
  </Stack>
);

export default FieldRow;
