import pandas as pd

# Load the dataset
df = pd.read_csv("dataset/spotify_20000.csv")

print("First 5 rows:")
print(df.head())

print("\nColumns:")
print(df.columns.tolist())

print("\nDataset shape:")
print(df.shape)

print("\nMissing values:")
print(df.isnull().sum())