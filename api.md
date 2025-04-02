env.PRODUCT_API_URL/api/products
body
{"name": "Test Product2", "sku": "TEST1234", "price": 99.99}
return
{
    "id": "67ec1a924bca78df62d39b86",
    "name": "Test Product2",
    "sku": "TEST1234",
    "price": 99.99
}

env.PRODUCT_API_URL/api/products/TEST123

return:
{
    "message": "Product deleted successfully"
}

env.AI_SERVICE_URL/api/generate-description

body
{"keywords": "modern minimalist coffee maker"}

return(raw)
Brew perfection with our modern minimalist coffee maker. Its sleek design seamlessly blends into any kitchen, delivering rich, flavorful coffee with simple one-touch operation. Enjoy your daily ritual in style!


env.AI_SERVICE_URL/api/generate-image
body:
{"keywords": "modern minimalist coffee maker"}

return

{"imageUrl":"https://oaidalleapiprodscus.blob.core.windows.net/private/org-4thMTxqafKtRBguRgVTi6pC0/user-MliTfxbaOi5fWdqKhX1S2kzq/img-yWzrProhfNseIUeyR65GOguI.png?st=2025-03-31T13%3A41%3A38Z&se=2025-03-31T15%3A41%3A38Z&sp=r&sv=2024-08-04&sr=b&rscd=inline&rsct=image/png&skoid=d505667d-d6c1-4a0a-bac7-5c84a87759f8&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2025-03-31T11%3A08%3A25Z&ske=2025-04-01T11%3A08%3A25Z&sks=b&skv=2024-08-04&sig=YoUNTvLzQsGDdy6kdCL/azqkYRe%2BRhXqIEWVtVpW2x8%3D"}