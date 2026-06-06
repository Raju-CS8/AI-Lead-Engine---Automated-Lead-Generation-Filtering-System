import { Component, ReactNode, ErrorInfo } from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';
import { ReportProblem } from '@mui/icons-material';

interface Props { children: ReactNode }
interface State { hasError: boolean; message: string }

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, message: '' };
  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, message: error.message };
  }
  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('[ErrorBoundary]', error, info);
  }
  render() {
    if (this.state.hasError) {
      return (
        <Box style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
          <Paper style={{ padding: 32, textAlign: 'center', maxWidth: 440 }}>
            <ReportProblem style={{ fontSize: 48, color: '#ef4444', marginBottom: 16 }} />
            <Typography variant="h6" gutterBottom>{this.state.message}</Typography>
            <Button variant="contained" onClick={() => this.setState({ hasError: false, message: '' })}>
              Try Again
            </Button>
          </Paper>
        </Box>
      );
    }
    return this.props.children;
  }
}