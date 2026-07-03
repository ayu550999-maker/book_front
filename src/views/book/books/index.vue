<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="ISBN编号" prop="isbn">
        <el-input
          v-model="queryParams.isbn"
          placeholder="请输入ISBN编号"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="图书名称" prop="bookName">
        <el-input
          v-model="queryParams.bookName"
          placeholder="请输入图书名称"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="作者" prop="author">
        <el-input
          v-model="queryParams.author"
          placeholder="请输入作者"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="出版社ID" prop="publisherId">
        <el-input
          v-model="queryParams.publisherId"
          placeholder="请输入出版社ID"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="分类ID" prop="categoryId">
        <el-input
          v-model="queryParams.categoryId"
          placeholder="请输入分类ID"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="出版日期" prop="publishDate">
        <el-date-picker clearable
          v-model="queryParams.publishDate"
          type="date"
          value-format="YYYY-MM-DD"
          placeholder="请选择出版日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="图书价格" prop="price">
        <el-input
          v-model="queryParams.price"
          placeholder="请输入图书价格"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="图书总数量" prop="totalNum">
        <el-input
          v-model="queryParams.totalNum"
          placeholder="请输入图书总数量"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="剩余可借数量" prop="remainNum">
        <el-input
          v-model="queryParams.remainNum"
          placeholder="请输入剩余可借数量"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="馆藏位置" prop="location">
        <el-input
          v-model="queryParams.location"
          placeholder="请输入馆藏位置"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="Plus"
          @click="handleAdd"
          v-hasPermi="['book:books:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="Edit"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['book:books:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['book:books:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Download"
          @click="handleExport"
          v-hasPermi="['book:books:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="booksList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="图书ID" align="center" prop="bookId" />
      <el-table-column label="ISBN编号" align="center" prop="isbn" />
      <el-table-column label="图书名称" align="center" prop="bookName" />
      <el-table-column label="作者" align="center" prop="author" />
      <el-table-column label="出版社ID" align="center" prop="publisherId" />
      <el-table-column label="分类ID" align="center" prop="categoryId" />
      <el-table-column label="出版日期" align="center" prop="publishDate" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.publishDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="图书价格" align="center" prop="price" />
      <el-table-column label="图书总数量" align="center" prop="totalNum" />
      <el-table-column label="剩余可借数量" align="center" prop="remainNum" />
      <el-table-column label="馆藏位置" align="center" prop="location" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['book:books:edit']">修改</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['book:books:remove']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    
    <pagination
      v-show="total>0"
      :total="total"
      v-model:page="queryParams.pageNum"
      v-model:limit="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改图书信息对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="booksRef" :model="form" :rules="rules" label-width="100px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="ISBN编号" prop="isbn">
              <el-input v-model="form.isbn" placeholder="请输入ISBN编号" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="图书名称" prop="bookName">
              <el-input v-model="form.bookName" placeholder="请输入图书名称" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="作者" prop="author">
              <el-input v-model="form.author" placeholder="请输入作者" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="出版社ID" prop="publisherId">
              <el-input v-model="form.publisherId" placeholder="请输入出版社ID" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="分类ID" prop="categoryId">
              <el-input v-model="form.categoryId" placeholder="请输入分类ID" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="出版日期" prop="publishDate">
              <el-date-picker clearable
                v-model="form.publishDate"
                type="date"
                value-format="YYYY-MM-DD"
                placeholder="请选择出版日期">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="图书价格" prop="price">
              <el-input v-model="form.price" placeholder="请输入图书价格" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="图书总数量" prop="totalNum">
              <el-input v-model="form.totalNum" placeholder="请输入图书总数量" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="剩余可借数量" prop="remainNum">
              <el-input v-model="form.remainNum" placeholder="请输入剩余可借数量" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="馆藏位置" prop="location">
              <el-input v-model="form.location" placeholder="请输入馆藏位置" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts" name="Books">
import type { Books, BooksQueryParams } from "@/types/api/book/books"
import { listBooks, getBooks, delBooks, addBooks, updateBooks } from "@/api/book/books"

const { proxy } = getCurrentInstance()

const booksList = ref<Books[]>([])
const open = ref<boolean>(false)
const loading = ref<boolean>(true)
const showSearch = ref<boolean>(true)
const ids = ref<number[]>([])
const single = ref<boolean>(true)
const multiple = ref<boolean>(true)
const total = ref<number>(0)
const title = ref<string>("")

const data = reactive({
  form: {} as Books,
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    isbn: undefined,
    bookName: undefined,
    author: undefined,
    publisherId: undefined,
    categoryId: undefined,
    publishDate: undefined,
    price: undefined,
    totalNum: undefined,
    remainNum: undefined,
    location: undefined
  } as BooksQueryParams,
  rules: {
    isbn: [
      { required: true, message: "ISBN编号不能为空", trigger: "blur" }
    ],
    bookName: [
      { required: true, message: "图书名称不能为空", trigger: "blur" }
    ],
    author: [
      { required: true, message: "作者不能为空", trigger: "blur" }
    ],
  }
})

const { queryParams, form, rules } = toRefs(data)

/** 查询图书信息列表 */
function getList() {
  loading.value = true
  listBooks(queryParams.value).then(response => {
    booksList.value = response.rows
    total.value = response.total
    loading.value = false
  })
}

/** 取消按钮 */
function cancel() {
  open.value = false
  reset()
}

/** 表单重置 */
function reset() {
  form.value = {
    bookId: null,
    isbn: null,
    bookName: null,
    author: null,
    publisherId: null,
    categoryId: null,
    publishDate: null,
    price: null,
    totalNum: null,
    remainNum: null,
    location: null
  }
  proxy.resetForm("booksRef")
}

/** 搜索按钮操作 */
function handleQuery() {
  queryParams.value.pageNum = 1
  getList()
}

/** 重置按钮操作 */
function resetQuery() {
  proxy.resetForm("queryRef")
  handleQuery()
}

/** 多选框选中数据 */
function handleSelectionChange(selection: Books[]) {
  ids.value = selection.map(item => item.bookId)
  single.value = selection.length != 1
  multiple.value = !selection.length
}

/** 新增按钮操作 */
function handleAdd() {
  reset()
  open.value = true
  title.value = "添加图书信息"
}

/** 修改按钮操作 */
function handleUpdate(row: Books) {
  reset()
  const _bookId = row.bookId || ids.value[0]
  getBooks(_bookId).then(response => {
    form.value = response.data
    open.value = true
    title.value = "修改图书信息"
  })
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["booksRef"].validate((valid: boolean) => {
    if (valid) {
      if (form.value.bookId != null) {
        updateBooks(form.value).then(() => {
          proxy.$modal.msgSuccess("修改成功")
          open.value = false
          getList()
        })
      } else {
        addBooks(form.value).then(() => {
          proxy.$modal.msgSuccess("新增成功")
          open.value = false
          getList()
        })
      }
    }
  })
}

/** 删除按钮操作 */
function handleDelete(row: Books) {
  const _bookIds = row.bookId || ids.value
  proxy.$modal.confirm('是否确认删除图书信息编号为"' + _bookIds + '"的数据项？').then(function() {
    return delBooks(_bookIds)
  }).then(() => {
    getList()
    proxy.$modal.msgSuccess("删除成功")
  }).catch(() => {})
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('book/books/export', {
    ...queryParams.value
  }, `books_${new Date().getTime()}.xlsx`)
}

getList()
</script>
