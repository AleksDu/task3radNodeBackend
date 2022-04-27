import app from '../app';

const PORT: string | number = process.env.PORT || 3000;

app.listen(PORT, async () => {
  await console.log(`Server running. Use our API on port: ${PORT}`);
});
