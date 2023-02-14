cd ./whisper
./stream -l ja -m ./models/ggml-base.bin -vth 0.1 --step 3000 --length 3000
# ./stream -l ja -m ./models/ggml-medium.bin -vth 0.3 --step 2000 --length 5000
