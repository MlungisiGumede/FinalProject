using Microsoft.ML.Data;

namespace IBIS_API.Models
{
    public class ModelOutput
    {
        [VectorType(1, 32, 768)]
        [ColumnName("last_hidden_state")]
        public Single[] LastHiddenState { get; set; }

        [ColumnName("output_0")]
        [VectorType(1, 2)]
        public Single[] output0 { get; set; }
    }
}

