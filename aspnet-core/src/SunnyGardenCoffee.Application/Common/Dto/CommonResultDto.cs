using Abp.Application.Services.Dto;
using System.Collections.Generic;

namespace SunnyGardenCoffee.Common.Dto
{
    public class CommonResultErrorDto
    {
        public bool IsSuccessful { get; set; } = false;
        public string ErrorCode { get; set; }
        public string ErrorMessage { get; set; }
    }

    public class CommonResultDto<T> : CommonResultErrorDto
    {
        public T DataResult { get; set; }

        public CommonResultDto(T dataSuccess)
        {
            DataResult = dataSuccess;
            IsSuccessful = true;
            ErrorCode = string.Empty;
            ErrorMessage = string.Empty;
        }

        public CommonResultDto(string errorMessage)
        {
            IsSuccessful = false;
            ErrorMessage = errorMessage;
        }

        public CommonResultDto(string errorCode, string errorMessage)
        {
            IsSuccessful = false;
            ErrorCode = errorCode;
            ErrorMessage = errorMessage;
        }

        public CommonResultDto() : base()
        {
            IsSuccessful = true;
        }

        public void SetDataSuccess(T data)
        {
            DataResult = data;
            IsSuccessful = true;
            ErrorCode = string.Empty;
            ErrorMessage = string.Empty;
        }
    }
    public class CommonPagedResultDto<T, Key> : PagedResultDto<T>
    {
        public List<Key> ListOfSelectedValue { get; set; }
        public CommonPagedResultDto(int totalCount, IReadOnlyList<T> items)
            : base(totalCount, items)
        {

        }

        public CommonPagedResultDto(int totalCount, IReadOnlyList<T> items, List<Key> listOfSelectedValue)
            : base(totalCount, items)
        {
            ListOfSelectedValue = listOfSelectedValue;
        }
    }

    public class CommonPagedResultDto<T> : CommonPagedResultDto<T, long>
    {
        public CommonPagedResultDto(int totalCount, IReadOnlyList<T> items)
            : base(totalCount, items)
        {

        }

        public CommonPagedResultDto(int totalCount, IReadOnlyList<T> items, List<long> listOfSelectedValue)
            : base(totalCount, items, listOfSelectedValue)
        {

        }
    }
}
