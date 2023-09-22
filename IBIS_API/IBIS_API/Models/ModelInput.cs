using Microsoft.ML;
using Microsoft.ML.Data;
using Microsoft.ML.OnnxRuntime;
using Microsoft.ML.Transforms.Onnx;

namespace IBIS_API.Models
{
    public class ModelInput
    {
        public int count = 0;
        //[VectorType(1, 32)]
        [VectorType(1, 512)]
        [ColumnName("input_ids")]
        public long[] InputIds { get; set; }

        //[VectorType(1, 32)]
        [VectorType(1, 512)]
        [ColumnName("attention_mask")]
        public long[] AttentionMask { get; set; }

        // [VectorType(1, 32)] // previously 32
        [ColumnName("token_type_ids")]
        [VectorType(1, 512)]
        public long[] TokenTypeIDs { get; set; }


        public OnnxTransformer ModelStartup()  // text summary algorithm then rating a review...
        {
            MLContext mlContext = new MLContext();
            var path = "./model2.onnx";
            // OnnxScoringEstimator estimator = mlContext.Transforms.ApplyOnnxModel("./model.onnx");
            var pipeline = mlContext.Transforms
                            .ApplyOnnxModel(modelFile: path,
                                            shapeDictionary: new Dictionary<string, int[]>
                                            {
                                                { "input_ids", new [] { 1, 512 } },
                                                { "attention_mask", new [] { 1, 512 } },
                                                { "output_0", new [] { -1, 2 } }
                                            },
                                            inputColumnNames: new[] {"input_ids",
                                                                     "attention_mask"},
                                            outputColumnNames: new[] { "output_0" }, gpuDeviceId: null, fallbackToCpu: false); // check this...
            var model = pipeline.Fit(mlContext.Data.LoadFromEnumerable(new List<ModelInput>()));
            return model;
        }
        public OnnxTransformer ModelStartup2(int count)  // text summary algorithm then rating a review...
        {
            MLContext mlContext = new MLContext();
            var path = "./model2.onnx";
            // OnnxScoringEstimator estimator = mlContext.Transforms.ApplyOnnxModel("./model.onnx");
            var pipeline = mlContext.Transforms
                            .ApplyOnnxModel(modelFile: path,
                                            shapeDictionary: new Dictionary<string, int[]>
                                            {
                                                { "input_ids", new [] { 1, 512 } },
                                                { "attention_mask", new [] { 1, 512 } },
                                                { "output_0", new [] { -1, 2 } }
                                            },
                                            inputColumnNames: new[] {"input_ids",
                                                                     "attention_mask"},
                                            outputColumnNames: new[] { "output_0" }, gpuDeviceId: null, fallbackToCpu: false); // check this...
            var list = new List<ModelInput>();

            var list2 = mlContext.Data.LoadFromEnumerable(new List<ModelInput>());
            //list2.Schema
            var model = pipeline.Fit(mlContext.Data.LoadFromEnumerable(new List<ModelInput>()));
            return model;
        }

    }
}

